from django.db import models
from django.contrib.auth.models import User
import datetime
import decimal
from django.db.models import Sum
import math
from django.utils import timezone

# example: 200mg aspirin, pills
class Item(models.Model):
    def __unicode__(self):
        try:
            return self.name + " " + self.category.name
        except:
            return self.name
    name = models.CharField(max_length=200)
    name_lower = models.CharField(max_length=200)
    category = models.ForeignKey('ItemCategory',blank=True,null=True)
    dispense_size = models.IntegerField(default=1)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        # check if dispense_size has changed
        else:
            old = Item.objects.get(id=self.id)
            if self.dispense_size != old.dispense_size:
                for l in Location.objects.filter(location_type__in="D"):
                    for sc in StockChange.objects.filter(location=l,itemlot__item=self,shipment__from_location__location_type__in="I"):
                        try:
                            sc.qty = int(sc.qty) / int(old.dispense_size)
                            sc.qty = int(sc.qty) * int(self.dispense_size)
                        except:
                            pass
                        sc.save()
        self.modified = timezone.now()
        self.name_lower = self.name.lower()
        self.name = self.name.strip()
        super(Item, self).save(*args, **kwargs)

    # gives the current quantity of all child lotes at a location 
    def soh(self,location,date):
        qty = 0
        for itemlot in self.itemlot_set.filter(shipment__active=True):
            try:
                qty = qty + itemlot.soh(location=location,date=date)
            # no stock changes at this location
            except:
                pass
        return qty
    # returns [soh, price]
    def soh_price(self,location,date):
        qty = 0
        price = 0
        for itemlot in self.itemlot_set.filter(shipment__active=True):
            try:
                item_lot_qty = itemlot.soh(location=location,date=date)
                qty = qty + item_lot_qty
                price = price + (decimal.Decimal(item_lot_qty) * decimal.Decimal(itemlot.unit_price))
            # no stock changes at this location
            except:
                pass
        return [qty,price]

    # returns the lot with the soonest expiration date
    def first_lot_expiring(self):
        latest_list = self.itemlot_set.exclude(expiration=None)
        if len(latest_list) <2:
            return None
        # no lotes
        try:
            latest = latest_list.filter(expired=False)[0]
        except:
            return None
        for itemlot in latest_list:
            if latest.expiration > itemlot.expiration:
                latest = itemlot
        return latest

# e.g. "Syrups, Mixture, Suspensions, Etc" 
class ItemCategory(models.Model):
    def __unicode__(self):
        return self.name
    name = models.CharField(max_length=200)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        self.name = self.name.strip()
        super(ItemCategory, self).save(*args, **kwargs)

class ItemAttribute(models.Model):
    def __unicode__(self):
        return self.item.name + " " + self.attribute + " " + self.value
    attribute = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    item = models.ForeignKey(Item)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        super(ItemAttribute, self).save(*args, **kwargs)

# example: 400 bottles of aspirin with the same expiration date that came in on the same shipment
# and were from the same manufacturuer (in theory have the same lot num)
class ItemLot(models.Model):
    def __unicode__(self):
        return self.item.name
    item = models.ForeignKey('Item')
    active = models.BooleanField(default=False)
    expiration = models.DateTimeField(blank=True,null=True)
    expired = models.BooleanField(default=False,blank=True)
    lot_num = models.CharField(max_length=200,blank=True,null=True)
    qty = models.IntegerField()
    unit_price = models.DecimalField(max_digits=15, decimal_places=2, blank=True,null=True)
    shipment = models.ForeignKey('Shipment')
    
    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        try:
            self.lot_num = self.lot_num.strip()
        except:
            pass
        super(ItemLot, self).save(*args, **kwargs)

    def total_price(self):
        if self.qty > 0:
            try:
                return (decimal.Decimal(self.unit_price) * decimal.Decimal(self.qty))
            except:
                return ""
        else:
            return ""

    # boolean that checks if this lot has expired
    # and if it has, adds an expired stockchange 
    # and marks 'expired' true
    # to be run w/ a cron job daily
    def check_expired(self):
        if self.expiration is not None:
            if self.expired:
                return True
            else:
                # this needs to be utc
                today = timezone.localtime(timezone.now())
                if self.expiration < today:
                    # add an expired entry in every location that has a stock balance
                    for location in Location.objects.exclude(location_type="S"):
                        curr_qty = self.soh(location=location)
                        if curr_qty > 0:
                            u = User.objects.all()[0]
                            s = StockChange(shipment__active=True,qty=(-curr_qty),location=location,date=self.expiration,shipment=self.shipment,itemlot=self,change_type="E",user=u)
                            s.save()
                    self.expired = True
                    self.save()
                    return True
                else:
                    return False

    # returns the total stock quantity for a location of this lot
    # date will count only up to and including the date
    def soh(self,location,date):
        qty = 0
        try:
            qty = self.stockchange_set.filter(location=location,date__lte=date,shipment__active=True).aggregate(Sum('qty'))['qty__sum']
        except:
            pass
        if qty is None:
            qty = 0
        return qty

# e.g. attribute : "no_soh", value: null (in use)
# e.g. attribute : "original_shipment" : value: "123" (not in use, just example)
# TODO remove, not used
class ItemLotAttribute(models.Model):
    attribute = models.CharField(max_length=200)
    value = models.CharField(max_length=200,null=True,blank=True)
    itemlot = models.ForeignKey(ItemLot)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        super(ItemLotAttribute, self).save(*args, **kwargs)

# example: 200 bottles of aspirin consumed at nohana
# there will be two of these for every transfer
class StockChange(models.Model):
    def __unicode__(self):
        return str(self.qty) + " " + self.change_type + " of " + str(self.itemlot.item.name) + " at " + self.location.name + " on " + str(self.date)
    CHANGE_TYPES = (
        ('R', 'Receive External'),
        ('T', 'Transfer'),
        ('E', 'Expired'),
        ('M', 'Miscount'),
        ('L', 'Loss'),
        ('C', 'Consumed'),
        ('D', 'Damaged'),
    )
    active = models.BooleanField(default=False)
    qty = models.IntegerField()
    location = models.ForeignKey('Location')
    date = models.DateTimeField(default=timezone.now)
    shipment = models.ForeignKey('Shipment',blank=True,null=True)
    itemlot = models.ForeignKey('ItemLot')
    change_type = models.CharField(max_length=2, choices=CHANGE_TYPES)
    note = models.TextField(blank=True)

    # gets the summary of stock changes up to and including 
    # this stock change from this location
    # at the item level (item = true)
    # or at the lot level (item = False)
    def soh(self,item=False):
        if item:
            return self.itemlot.item.soh(location=self.location,date=self.date)
        else:
            return self.itemlot.soh(location=self.location,date=self.date)

    def price(self):
        if self.itemlot.unit_price:
            return decimal.Decimal(self.itemlot.unit_price) * decimal.Decimal(self.qty)
        else:
            return decimal.Decimal(0)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        else:
            self.active = self.shipment.active
        self.modified = timezone.now()
        # TODO this needs to be removed & fixed globally 
        self.date = timezone.localtime(self.date).replace(hour=0)
        self.date = timezone.localtime(self.date).replace(minute=0)
        self.date = timezone.localtime(self.date).replace(second=0)
        self.date = timezone.localtime(self.date).replace(microsecond=0)
        super(StockChange, self).save(*args, **kwargs)

# equivalent to the transfer/shipment slip
# list of stock changes that all are going to/from somewhere
class Shipment(models.Model):
    def __unicode__(self):
        return str(self.id) + " " + self.from_location.name + " to " + self.to_location.name + " on " + timezone.localtime(self.date).strftime('%d/%m/%Y')
    INVOICE_TYPES = (
        ('R', 'Receive External'),
        ('T', 'Transfer'),
        ('D', 'Dispense'),
    )
    # related_name is because django creates a Location.shipment_set on the 
    # shipment model, and having two foreign keys means the two auto-assigned
    # names (location.shipment_set) conflict. now you can reference either with
    # fromsite_set or tosite_set
    active = models.BooleanField(default=False)
    from_location = models.ForeignKey('Location', related_name='from_location_set')
    to_location = models.ForeignKey('Location', related_name='to_location_set')
    name = models.CharField(max_length=200, blank=True,null=True)
    date = models.DateTimeField(default=timezone.now)
    # received_by = models.CharField(max_length=200)
    shipment_type = models.CharField(max_length=2, choices=INVOICE_TYPES)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        else:
            ItemLot.objects.filter(shipment=self).update(active=self.active)
            StockChange.objects.filter(shipment=self).update(active=self.active,date=self.date)
            StockChange.objects.filter(shipment=self,qty__gt=0).update(location=self.to_location)
            # this won't change suppliers...
            StockChange.objects.filter(shipment=self,qty__lt=0).update(location=self.from_location)
        self.modified = timezone.now()
        if not self.name:
            if self.shipment_type == "T" and self.name != "" and self.active == True:
                try:
                    self.name = int(Shipment.objects.filter(shipment_type="T",active=True,to_location__location_type__in="I,D").order_by('-created')[0].name) + 1
                except:
                    self.name = "1"
                try:
                    self.name = self.name.strip()
                except:
                    pass
            else:
                self.name = self.id
        super(Shipment, self).save(*args, **kwargs)

    def price(self):
        scs = self.stockchange_set.filter(location=self.to_location)
        price = decimal.Decimal(0.0)
        any_price = False
        for sc in scs:
            if sc.price():
                any_price = True
                if self.from_location.location_type=="I" and self.to_location.location_type=="D":
                    price = decimal.Decimal(price) + decimal.Decimal(sc.price() / sc.itemlot.item.dispense_size)
                else:
                    price = decimal.Decimal(price) + decimal.Decimal(sc.price())
        if any_price:
            return price
        else:
            return decimal.Decimal(0)

    def item_count(self):
        scs = self.stockchange_set.filter(location=self.to_location)
        items = {}
        for sc in scs:
            items[sc.itemlot.item.id] = True
        return len(items)

class Location(models.Model):
    LOCATION_TYPES = (
        ('I', 'Inventory'),
        ('D', 'Dispensary'),
        ('S', 'External'),
        ('V', 'Virtual'),
        ('P', 'Patient'),
    )
    def __unicode__(self):
        return self.name
    location_type = models.CharField(max_length=2, choices=LOCATION_TYPES)
    name = models.CharField(max_length=100)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        super(Location, self).save(*args, **kwargs)

class District(models.Model):
    def __unicode__(self):
        return self.name
    name = models.CharField(max_length=100,unique=True)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        super(District, self).save(*args, **kwargs)

# CP wants this data for demographics
# not intended for EMR usage
# were that the case, would need to merge with OpenMRS
# (maybe using JSS/Thoughtwork's Atom Feed approach)

class Patient(models.Model):
    GENDER_TYPES = (
        ('N', 'Not Specified'),
        ('M', 'Male'),
        ('F', 'Female')
    )
    def __unicode__(self):
        return self.location.name
    gender = models.CharField(max_length=2, choices=GENDER_TYPES,null=True)
    # if needed we'll do this later with many to many table like openmrs
    identifier = models.CharField(max_length=100,blank=True,null=True)
    dob = models.DateTimeField(null=True)
    # this is not an openmrs location, nor a location drugs are shipped to.
    # like openerp, models patients as physcial locations themseleves
    location = models.ForeignKey('Location')

    # CP tracks only district
    district = models.ForeignKey('District',blank=True,null=True)

    created = models.DateTimeField(editable=False,null=True)
    modified = models.DateTimeField(null=True)
    user = models.ForeignKey(User)
    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.created:
            self.created = timezone.now()
        self.modified = timezone.now()
        super(Patient, self).save(*args, **kwargs)
