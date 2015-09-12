from inventory import reporting_utils
from inventory import raw_stockchanges
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render_to_response, redirect
import simplejson as json
from django.db.models import Sum
from django.template import RequestContext
from django.http import HttpResponse
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute, ItemCategory
	
# read, html views
@ensure_csrf_cookie
def home(request):
    return render_to_response('index.html', {}, context_instance=RequestContext(request))

# read, html views
@ensure_csrf_cookie
def reportingdash(request):
    return render_to_response('reportingdash.html', {}, context_instance=RequestContext(request))

def print_shipment(request,pk):
    if not request.user.is_authenticated():
        return redirect('/admin/')
    shipment = Shipment.objects.get(id=pk)
    shipment_item_lists = []
    shipment_items = []
    for i,item in enumerate(shipment.stockchange_set.filter(location=shipment.from_location)):
        if i % 10 == 0:
            if len(shipment_items) > 0:
                shipment_item_lists.append(shipment_items)
                shipment_items = []
        try:
            item.item_mgmt_group = ItemAttribute.objects.filter(item=item.itemlot.item, attribute='mgmt_group')[0].value
        except:
            pass
        item.qty = -1*item.qty
        if item.qty > 0:
            shipment_items.append(item)
    shipment_item_lists.append(shipment_items)
    try:
        internal = request.GET["internal_billing"]
        if internal == "true":
            internal_billing_document = True
        else:
            internal_billing_document = False
    except:
        internal_billing_document = False
    return render_to_response('print_shipment.html', {'shipment' : shipment, 'internal_billing_document' : internal_billing_document, 'shipment_item_lists' : shipment_item_lists}, context_instance=RequestContext(request))

def report(request):
    itemlot_level = False
    if "itemlot_level" in request.GET and request.GET["itemlot_level"] == "true":
        itemlot_level = True
    if "category" in request.GET:
        category_id = request.GET["category"]
    else:
        category_id = None
    if "location" in request.GET:
        location_id = request.GET["location"]
    else:
        location_id = 1
    if "end_date" in request.GET:
        end_date = request.GET["end_date"]
    else:
        end_date = None
    if "date" in request.GET:
        date = request.GET["date"]
    else:
        date = None
    data = reporting_utils.raw_inventory_report(itemlot_level=itemlot_level,report_type=request.GET["report_type"],location_id=location_id,category_id=category_id,date=date,end_date=end_date)
    return HttpResponse(json.dumps(data), mimetype='application/json')

def stockchanges(request):
    data = raw_stockchanges.get_stockchanges()
    return HttpResponse(json.dumps(data), mimetype='application/json')
