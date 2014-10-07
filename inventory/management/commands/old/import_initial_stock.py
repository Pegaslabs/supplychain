from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
import math
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    args = '<filepath> <name>'
    help = 'imports items in tab separated txt <filepath> mgmt_group \t name \t qty \t expiration \t price \t lot_num'
    # item_attrs[0] mgmt_group, item_attrs[1] item_name, item_attrs[2] qty, item_attrs[3] expiration, item_attrs[4] unit_price, item_attrs[5] lot_num

    def handle(self, *args, **options):
        system = User.objects.get(username='system')
        supplier = Location.objects.get(name="Initial Warehouse Count")
        warehouse = Location.objects.get(location_type='I')
        s = controller.update_shipment({'active' : True, 'from_location' : supplier.id, 
            'to_location' : warehouse.id, 'user' : 1, 'shipment_type' : 'R', 
            'date' : '01/7/2013', 'name' : args[1]})
        f = open(args[0])
        for line in f:
            item_attrs = line.split("\t")
            # make item. make sure it's not already there
            item = controller.update_item({'name' : item_attrs[1], 'user' : system.id, 'attributes' : [{'mgmt_group' : item_attrs[0]}]})
            # make lot
            expiration = item_attrs[3] if item_attrs[3] else ""
            lot_num = item_attrs[5] if item_attrs[5] else ""
            if item_attrs[2]:
                try:
                    qty = int(item_attrs[2])
                except:
                    qty = math.ceil(float(item_attrs[2]))
            else:
                qty = 0
            da = {'item' : item['item'], 'active' : True, 'expiration' : expiration, 'lot_num' : lot_num, 'qty' : qty, 'shipment' : s['shipment'], 'user' : system.id, 'unit_price' : item_attrs[4]}
            response = controller.update_itemlot(da)
            if len(response['errors']) > 0:
                for error in response['errors']:
                    print 'datashipment error: ', error
            else:
                if da['expiration']:
                    print "created item lot " + expiration + " lot " + da['lot_num'] + " qty: " + str(da['qty'])  
                else:
                    print "created item lot " + da['lot_num'] + " qty: " + str(da['qty']) + " price: " + str(da['unit_price'])                 
                # make stock change
                sc = {'active' : True, 'qty' : qty, 'location' : warehouse.id, 'date' : '01/7/2013',
                    'shipment' : s['shipment'], 'itemlot' : response['itemlot'], 'change_type' : "R", 'user' : system.id
                    }
                response = controller.update_stockchange(sc)
                if len(response['errors']) > 0:
                    for error in response['errors']:
                        print 'stockchange error ', error
    print 'Importing.'
