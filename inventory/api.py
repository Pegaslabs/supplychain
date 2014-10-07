from django.db.models import Q
from itertools import chain
import simplejson as json
from inventory import reporting_utils
from datetime import timedelta,datetime
from django.utils import timezone
from django.http import Http404
from bots import settings
from tastypie.resources import ModelResource,Resource
from inventory.models import Item,ItemCategory,ItemAttribute,ItemLotAttribute,ItemLot,StockChange,Shipment,Location,District,Patient
from accounts.models import UserPreferences
from django.db.models import Sum
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication,Authentication
from tastypie.authorization import Authorization
from django.core.exceptions import ObjectDoesNotExist
 
 # I don't know what's going on with tastypie or djangor or http-proxy 
 # but they're not playing nice. disabling csrf for e2e testing 
def get_auth():
    # if settings.testing:
    #     return Authentication()
    # else:
    return SessionAuthentication()

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        always_return_data = True
        resource_name = 'user'
        filtering = {'username' : ALL}
        excludes = ['password', 'last_name', 'first_name', 'last_login','date_joined', 'is_active', 'is_staff', 'is_superuser']
        authorization= Authorization()
        authentication = get_auth()

class ItemCategoryResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = ItemCategory.objects.all()
        always_return_data = True
        resource_name = 'itemcategory'
        filtering = {'name' : ALL}
        ordering = {'name' : ALL}
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(ItemCategoryResource,self).obj_create(bundle, **kwargs)  

class ItemResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    category = fields.ForeignKey(ItemCategoryResource, 'category',full=True)
    class Meta:
        queryset = Item.objects.all()
        always_return_data = True
        resource_name = 'item'
        filtering = {'alias' : ALL, 'name' : ALL, 'name_lower' : ALL, 'category' : ALL}
        excludes = ['modified','created']
        ordering = {'name' : ALL, 'name_lower' : ALL, 'category' : ALL}
        authorization= Authorization()
        authentication = get_auth()
    def dehydrate(self, bundle):
        if bundle.request.GET.get('soh'):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            bundle.data['soh'] = bundle.obj.soh(location=l,date=bundle.request.GET.get('soh'))
        if bundle.request.GET.get('soh_price'):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            soh_price = bundle.obj.soh_price(location=l,date=bundle.request.GET.get('soh_price'))
            bundle.data['soh'] = soh_price[0]
            bundle.data['price'] = soh_price[1]
        if bundle.request.GET.get('soh_by_location'):
            if bundle.request.GET.get('location_type_inventory'):
                internal_locations = Location.objects.filter(location_type__in="I,V")
            else:
                internal_locations = Location.objects.filter(location_type__in="D")
            bundle.data['locations'] = []
            # getting soh by locations only for a single item lot
            if bundle.request.GET.get('itemlot'):
                il = ItemLot.objects.get(id=bundle.request.GET.get('itemlot'))
            for location in internal_locations:
                if bundle.request.GET.get('itemlot'):
                    soh = il.soh(location=location,date=bundle.request.GET.get('soh_by_location'))
                else:
                    soh = bundle.obj.soh(location=location,date=bundle.request.GET.get('soh_by_location'))
                bundle.data['locations'].append({"location" : {"id" : location.id, "name" : location.name}, "soh" : soh})
        if bundle.request.GET.get('monthly_consumption_by_year'):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            y = bundle.request.GET.get('monthly_consumption_by_year')
            months = []
            qty_by_months = []
            for i in range(1,13):
                months.append("%s-%s-1" % (y,i))
            months.append(str(int(y)+1) + "-1-1")
            for i in range(0,12):
                if bundle.request.GET.get('itemlot'):
                    scs = StockChange.objects.filter(itemlot_id__exact=bundle.request.GET.get('itemlot'),shipment__active=True,date__gte=months[i],date__lte=months[i+1],shipment__from_location=l,shipment__to_location__location_type__in="I,D,P",location=l)
                else:
                    scs = StockChange.objects.filter(itemlot__item=bundle.obj,shipment__active=True,date__gte=months[i],date__lte=months[i+1],shipment__from_location=l,shipment__to_location__location_type__in="I,D,P",location=l)
                qty = scs.aggregate(Sum('qty'))['qty__sum']
                # need to check if we should put zeros or nulls
                # i.e. in our range we care about for amc
                if qty is None:
                    # .month is mar = 3 not 2
                    if (timezone.now().year == int(y) and i < timezone.now().month):
                        qty = 0
                    elif int(y) == 2013 and i > 6:
                        qty = 0
                else:
                    qty = -1*qty
                qty_by_months.append(qty)
            bundle.data['monthly_consumption_by_year'] = qty_by_months
        if bundle.request.GET.get("amc"):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            start_date = datetime.strptime(bundle.request.GET.get('start_date'), "%Y-%m-%d") 
            end_date = datetime.strptime(bundle.request.GET.get('end_date'), "%Y-%m-%d") 
            scs_consumption = StockChange.objects.filter(itemlot__item=bundle.obj,shipment__active=True,
                date__gte=start_date,date__lte=end_date,shipment__from_location=l,
                shipment__to_location__location_type__in="I,D,P",location=l)
            diff_months = (end_date-start_date).days / 30
            # make sure we don't divide by 0
            diff_months = 1 if diff_months == 0 else diff_months
            qty_consumed =  scs_consumption.filter(qty__lte=0).aggregate(Sum('qty'))['qty__sum']
            qty_consumed = -1*qty_consumed if qty_consumed else 0
            bundle.data['amc'] = qty_consumed / diff_months

        return bundle
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(ItemResource,self).obj_create(bundle, **kwargs)  

class ItemAttributeResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    item = fields.ForeignKey(ItemResource, 'item')
    class Meta:
        queryset = ItemCategory.objects.all()
        always_return_data = True
        resource_name = 'itemattribute'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()

class LocationResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    patient = fields.ForeignKey('inventory.api.PatientResource','patient',blank=True,null=True)
    class Meta:
        queryset = Location.objects.all()
        always_return_data = True
        resource_name = 'location'
        filtering = {'location_type' : ALL_WITH_RELATIONS, 'patient': ALL_WITH_RELATIONS, 'name' : ALL}
        ordering = {'name' : ALL}
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(LocationResource, self).build_filters(filters)
        if('name__contains' in filters):
            query = filters['name__contains']
            qset = (Q(name__icontains=query) | Q(patient__identifier__icontains=query))
            orm_filters.update({'custom': qset})
        return orm_filters
    def apply_filters(self, request, applicable_filters):
        print applicable_filters
        if 'custom' in applicable_filters:
            custom = applicable_filters.pop('custom')
            applicable_filters.pop('name__contains')
        else:
            custom = None
        semi_filtered = super(LocationResource, self).apply_filters(request, applicable_filters)
        return semi_filtered.filter(custom) if custom else semi_filtered
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(LocationResource,self).obj_create(bundle, **kwargs)
    def dehydrate(self, bundle):
        if bundle.obj.location_type == "P":
            bundle.data['name'] = bundle.obj.__unicode__()
        return bundle
class UserPreferencesResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user',full=True)
    default_location = fields.ForeignKey(LocationResource, 'default_location',full=True)
    default_to_location = fields.ForeignKey(LocationResource, 'default_to_location',full=True)
    class Meta:
        queryset = UserPreferences.objects.all()
        always_return_data = True
        filtering = {"user" : ALL_WITH_RELATIONS}
        resource_name = 'userpreferences'
        authorization= Authorization()
        excludes = ['modified','created']
        authentication = get_auth()
    def authorized_read_list(self, object_list, bundle):
        try:
            return object_list.filter(user=bundle.request.user)
        except:
            return object_list.filter(user=None)

class ShipmentResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user',full=True)
    from_location = fields.ForeignKey(LocationResource, 'from_location',full=True)
    to_location = fields.ForeignKey(LocationResource, 'to_location',full=True)
    price = fields.DecimalField(attribute='price',readonly=True)
    item_count = fields.IntegerField(attribute='item_count',readonly=True)
    class Meta:
        filtering = {'active' : ['exact'], 'shipment_type' : ['exact'], 'name' : ALL, 'date' : ALL, "to_location" : ALL_WITH_RELATIONS, "from_location" : ALL_WITH_RELATIONS}
        ordering = {'date' : ['exact'], 'modified' : ALL, 'id' : ALL}
        queryset = Shipment.objects.all()
        always_return_data = True
        resource_name = 'shipment'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(ShipmentResource,self).obj_create(bundle, **kwargs)
    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(ShipmentResource, self).build_filters(filters)
        if('location' in filters):
            query = filters['location']
            qset = (Q(from_location=query) | Q(to_location=query))
            orm_filters.update({'custom': qset})
        return orm_filters
    def apply_filters(self, request, applicable_filters):
        if 'custom' in applicable_filters:
            custom = applicable_filters.pop('custom')
        else:
            custom = None
        semi_filtered = super(ShipmentResource, self).apply_filters(request, applicable_filters)
        return semi_filtered.filter(custom) if custom else semi_filtered

class ItemLotResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user',full=True)
    item = fields.ForeignKey(ItemResource,'item',full=True)
    shipment = fields.ForeignKey(ShipmentResource, 'shipment')
    qty_expiring = fields.IntegerField(readonly=True)
    class Meta:
        queryset = ItemLot.objects.all()
        always_return_data = True
        filtering = {'item' : ALL_WITH_RELATIONS,'shipment' : ALL, "expiration" : ALL}
        ordering = {'expiration' : ALL, "shipment" : ALL, "item" : ALL}
        resource_name = 'itemlot'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(ItemLotResource, self).build_filters(filters)

        if "soh__gt" in filters:
            l = Location.objects.get(id=filters['location'])
            try:
                itemlots = ItemLot.objects.filter(item=filters['item'],shipment__active=True)
            except:
                itemlots = ItemLot.objects.filter(shipment__active=True)
            if "expiration__lt" in filters:
                itemlots = itemlots.filter(expiration__gte=filters["expiration__gte"],expiration__lt=filters["expiration__lt"])
            pk_list = []
            for itemlot in itemlots:
                if 'soh' in filters:
                    if itemlot.soh(location=l,date=filters['soh']) > 0:
                        pk_list.append(itemlot)
                elif 'soh_price' in filters:
                    if itemlot.soh(location=l,date=filters['soh_price']) > 0:
                        pk_list.append(itemlot)

            orm_filters["pk__in"] = [i.pk for i in pk_list]

        if "soh__lt" in filters:
            l = Location.objects.get(id=filters['location'])
            itemlots = ItemLot.objects.filter(shipment__active=True)
            pk_list = []
            for itemlot in itemlots:
                if itemlot.soh(location=l,date=filters['soh']) < 0:
                    pk_list.append(itemlot)

            orm_filters["pk__in"] = [i.pk for i in pk_list]
        return orm_filters
    def dehydrate(self, bundle):
        if bundle.request.GET.get('soh'):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            bundle.data["soh"] = bundle.obj.soh(location=l,date=bundle.request.GET.get('soh'))
        if bundle.request.GET.get("consumption_report"):
            bundle.data = reporting_utils.create_consumption_report_bundle(bundle,itemlot_level=True)
        return bundle
    def dehydrate_qty_expiring(self, bundle):
        if bundle.request.GET.get("expirations"):
            l = Location.objects.get(id=bundle.request.GET.get('location'))
            return bundle.obj.soh(location=l,date=bundle.obj.expiration-timedelta(days=(1)))
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        bundle = super(ItemLotResource,self).obj_create(bundle, **kwargs)
        if bundle.obj.qty != 0:
            # existing
            try:
                sc = StockChange.objects.filter(itemlot=bundle.obj).order_by('id')[0]
                sc.qty=bundle.obj.qty
                sc.active=bundle.obj.active
                sc.user=bundle.request.user
                sc.location=bundle.obj.shipment.to_location
                sc.date=bundle.obj.shipment.date
                sc.save()
            except IndexError:
                StockChange(qty=bundle.obj.qty,user=bundle.request.user,
                    location=bundle.obj.shipment.to_location,date=bundle.obj.shipment.date,
                    shipment=bundle.obj.shipment,itemlot=bundle.obj,change_type="R").save()
        return bundle
    def get_object_list(self, request):
        l = super(ItemLotResource, self).get_object_list(request)
        # for obj in l:
        return l

class ItemLotAttributeResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user',full=True)
    itemlot = fields.ForeignKey(ItemLotResource,'itemlot',full=True)
    class Meta:
        queryset = ItemLotAttribute.objects.all()
        always_return_data = True
        filtering = {'attribute' : ALL,'itemlot' : ALL_WITH_RELATIONS}
        resource_name = 'itemlotattribute'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        bundle = super(ItemLotAttributeResource,self).obj_create(bundle, **kwargs)
        return bundle

class StockChangeResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user',full=True)
    location = fields.ForeignKey(LocationResource, 'location')
    shipment = fields.ForeignKey(ShipmentResource, 'shipment')
    itemlot = fields.ForeignKey(ItemLotResource, 'itemlot',full=True)
    soh = fields.IntegerField(readonly=True)
    class Meta:
        queryset = StockChange.objects.all()
        max_limit = None
        always_return_data = True
        filtering = {'shipment' : ALL_WITH_RELATIONS, 'qty' : ALL, 'itemlot' : ALL_WITH_RELATIONS, "location" : ALL_WITH_RELATIONS,'active' : 'exact', 'date' : ALL}
        ordering = {'date' : ALL, 'change_type' : ALL, "id" : ALL, "itemlot" : ALL_WITH_RELATIONS, "qty" : ALL}
        resource_name = 'stockchange'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def dehydrate_soh(self, bundle):
        if bundle.request.GET.get('itemlot'):
            return bundle.obj.soh(item=False)
        else:
            return bundle.obj.soh(item=True)
    def dehydrate(self,bundle):
        if bundle.request.GET.get('include_shipment'):
            bundle.data["shipment"] = {
                "id" : bundle.obj.shipment.id,
                "name" : bundle.obj.shipment.name,
                "to_location" : bundle.obj.shipment.to_location.name,
                "from_location" : bundle.obj.shipment.from_location.name
            }
        if bundle.request.GET.get('include_location'):
            bundle.data["location"] = {
                "id" : bundle.obj.location.id,
                "name" : bundle.obj.location.name,
            }
        return bundle
    def obj_create(self, bundle, **kwargs):
        bundle.data["user"] = {"id" : bundle.request.user.id}
        bundle = super(StockChangeResource,self).obj_create(bundle, **kwargs)
        if bundle.obj.shipment.shipment_type == "T":
            StockChange(qty=(0-int(bundle.obj.qty)),user=bundle.request.user,
                location=bundle.obj.shipment.from_location,date=bundle.obj.shipment.date,
                shipment=bundle.obj.shipment,itemlot=bundle.obj.itemlot,change_type="T").save()
            # translate dispense size: 10 items w/ dispense_size 50 = 500 items
            if bundle.obj.shipment.to_location.location_type=="D" and bundle.obj.shipment.from_location.location_type=="I":
                if bundle.obj.itemlot.item.dispense_size:
                    bundle.obj.qty = bundle.obj.qty * bundle.obj.itemlot.item.dispense_size
                    bundle.obj.save()
            if bundle.obj.shipment.to_location.location_type=="I" and bundle.obj.shipment.from_location.location_type=="D":
                if bundle.obj.itemlot.item.dispense_size:
                    bundle.obj.qty = bundle.obj.qty / bundle.obj.itemlot.item.dispense_size
                    bundle.obj.save()
        return bundle
    def obj_update(self, bundle, **kwargs):
        bundle = super(StockChangeResource,self).obj_update(bundle, **kwargs)
        if bundle.obj.shipment.shipment_type == "T":
            sc = StockChange.objects.filter(shipment=bundle.obj.shipment,itemlot=bundle.obj.itemlot).order_by('qty')[0]
            sc.qty = 0 - int(bundle.obj.qty)
            sc.active=bundle.obj.active
            sc.location=bundle.obj.shipment.from_location
            sc.date=bundle.obj.shipment.date
            sc.save()
        if bundle.obj.shipment.to_location.location_type=="D" and bundle.obj.shipment.from_location.location_type=="I":
            if bundle.obj.itemlot.item.dispense_size:
                bundle.obj.qty = bundle.obj.qty * bundle.obj.itemlot.item.dispense_size
                bundle.obj.save()
        if bundle.obj.shipment.to_location.location_type=="I" and bundle.obj.shipment.from_location.location_type=="D":
            if bundle.obj.itemlot.item.dispense_size:
                bundle.obj.qty = bundle.obj.qty / bundle.obj.itemlot.item.dispense_size
                bundle.obj.save()
        return bundle
    def obj_delete(self, bundle, **kwargs):
        sc = StockChange.objects.filter(shipment=bundle.obj.shipment,itemlot=bundle.obj.itemlot).order_by('qty')[0]
        sc.delete()
        bundle = super(StockChangeResource,self).obj_delete(bundle, **kwargs)
        return bundle

class DistrictResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = District.objects.all()
        always_return_data = True
        resource_name = 'district'
        filtering = {'name' : ALL}
        ordering = {'name' : ALL}
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(DistrictResource,self).obj_create(bundle, **kwargs)  

class PatientResource(ModelResource):
    district = fields.ForeignKey(DistrictResource,'district',full=True,blank=True,null=True)
    location = fields.ForeignKey(LocationResource,'location',full=True,blank=True,null=True)
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Patient.objects.all()
        always_return_data = True
        filtering = {'name' : ALL,'identifier' : ALL,'location' : ALL}
        resource_name = 'patient'
        excludes = ['modified','created']
        authorization= Authorization()
        authentication = get_auth()
    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = {"id" : bundle.request.user.id}
        return super(PatientResource,self).obj_create(bundle, **kwargs)

class SearchObject(object):
    def __init__(self, id=None, name=None):
        self.id = id
        self.name = name

class SearchResource(Resource):
    # id = fields.CharField(attribute='id')
    # name = fields.CharField(attribute='name')

    class Meta:
        resource_name = 'search'
        allowed_methods = ['get']
        object_class = SearchObject
        authorization = Authorization()
        authentication = get_auth()
        object_name = "search"
        include_resource_uri = False

    def dehydrate(self,bundle):
        bundle.data["resource_type"] = bundle.obj.__class__.__name__
        if bundle.data["resource_type"] == "Patient":
            bundle.data["id"] = bundle.obj.location.id
        else:
            bundle.data["id"] = bundle.obj.id
        if bundle.data["resource_type"] == "Location" and bundle.obj.location_type == "P":
            bundle.data["name"] = bundle.obj.__unicode__() + " (patient)"
        else:
            bundle.data["name"] = bundle.obj.__unicode__() + " ("  + bundle.obj.__class__.__name__.lower() + ")"
        return bundle

    def get_object_list(self, bundle, **kwargs):
        query = bundle.request.GET.get('name__contains', None)
        if not query:
            query = ""

        query = query.lower()
        if "item" in query:
            query = query.strip("item ")
            return Item.objects.filter(name__icontains=query).order_by('name')
        elif "location" in query:
            query = query.strip("location ")
            return Location.objects.filter(name__icontains=query,location_type__in="I,D,S,V").order_by('name')
        elif "shipment" in query:
            query = query.strip("shipment ")
            return Shipment.objects.filter(Q(id__startswith=query) | Q(name__startswith=query)).order_by('id','name')
        elif "patient" in query:
            query = query.strip("patient ")
            patients = Patient.objects.filter(identifier__icontains=query).order_by('identifier')
            locations = Location.objects.filter(name__icontains=query,location_type="P").order_by('name')
            return list(chain(patients,locations))

        items = Item.objects.filter(name__icontains=query).order_by('name')
        locations = Location.objects.filter(name__icontains=query).exclude(location_type="P").order_by('name')
        shipments = Shipment.objects.filter(Q(id__startswith=query) | Q(name__startswith=query)).order_by('name')
        patients = Patient.objects.filter(identifier__icontains=query).order_by('identifier')

        return list(chain(items, locations, shipments, patients))

    def obj_get_list(self, bundle, **kwargs):
        return self.get_object_list(bundle, **kwargs)