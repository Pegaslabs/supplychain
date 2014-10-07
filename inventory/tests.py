from django.test import TestCase
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute
from django.contrib.auth.models import User
from copy import copy

class TestItem(TestCase):
    def setUp(self):
        self.base_item = {'name' : 'test item', 'attributes' : [], 'user' : 1}
        self.base_item_b = {'name' : 'test item 2', 'attributes' : [], 'user' : 1}

    def test_valid_add_item(self):
        item_test_valid_helper(self,self.base_item)
        item_test_valid_helper(self,self.base_item_b, "attributes", [{"mgmt_group" : 'stuff'}])

    def test_invalid_add_item(self):
        item_test_valid_helper(self,self.base_item)
        # should be a name by now
        item_test_invalid_helper(self,self.base_item, "name","test item")
        item_test_invalid_helper(self,self.base_item, "name","Test item")
        item_test_invalid_helper(self,self.base_item, "name","Test drUg")
        item_test_invalid_helper(self,self.base_item, "name", "")

    def test_valid_update_item(self):
        response = controller.update_item(self.base_item)
        response_b = controller.update_item(self.base_item_b)
        update_item = response['item']
        controller.update_item({'id' : update_item, 'name' : 'kevin', 'update' : True})
        self.assertTrue(Item.objects.get(id=update_item).name == 'kevin')

def item_test_valid_helper(self, base_obj, key=None, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_item(receive)
    self.assertTrue(response['success'] == True,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

def item_test_invalid_helper(self, base_obj, key, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_item(receive)
    test_condition = (len([x for x in response['errors'] if x['error_field'] == key]) == 1)
    self.assertTrue(response['success'] == False and test_condition,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

class TestShipment(TestCase):
    def setUp(self):
        self.supplier = Location.objects.filter(location_type="S")[0]
        clinics = Location.objects.filter(location_type="C")
        self.clinic = clinics[0]
        self.clinic_b = clinics[1]
        self.user = User.objects.all()[0]
        self.base_receive = {'active' : True, 'from_location' : self.supplier.id, 'to_location' : self.clinic.id, 'user' : self.user.id, 'shipment_type' : 'R', 'date' : '01/7/2013', 'name' : 'test id'}
        self.base_transfer = {'active' : True, 'from_location' : self.clinic.id, 'to_location' : self.clinic_b.id, 'user' : self.user.id, 'shipment_type' : 'T', 'date' : '01/7/2013'}

    def test_valid_add_shipments(self):
        shipment_test_valid_helper(self,self.base_receive)
        shipment_test_valid_helper(self,self.base_transfer)
        shipment_test_valid_helper(self,self.base_transfer,"active",False)

    def test_invalid_add_receives(self):
        shipment_test_invalid_helper(self,self.base_receive,"date","")
        shipment_test_invalid_helper(self,self.base_receive,"active","")
        shipment_test_invalid_helper(self,self.base_receive,"date","70/02/02")
        shipment_test_invalid_helper(self,self.base_receive,"from_location","")
        shipment_test_invalid_helper(self,self.base_receive,"from_location",self.clinic.id)
        shipment_test_invalid_helper(self,self.base_receive,"to_location","")
        shipment_test_invalid_helper(self,self.base_receive,"to_location",self.supplier.id)
        shipment_test_invalid_helper(self,self.base_receive,"name","")

    def test_invalid_add_transfers(self):
        shipment_test_invalid_helper(self,self.base_transfer,"date","")
        shipment_test_invalid_helper(self,self.base_transfer,"active","")
        shipment_test_invalid_helper(self,self.base_transfer,"date","70/02/02")
        shipment_test_invalid_helper(self,self.base_transfer,"from_location","")
        shipment_test_invalid_helper(self,self.base_transfer,"from_location",self.supplier.id)
        shipment_test_invalid_helper(self,self.base_transfer,"to_location","")
        shipment_test_invalid_helper(self,self.base_transfer,"to_location",self.supplier.id)
        shipment_test_invalid_helper(self,self.base_transfer,"name","asdf")

def shipment_test_valid_helper(self, base_obj, key=None, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_shipment(receive)
    self.assertTrue(response['success'] == True,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

def shipment_test_invalid_helper(self, base_obj, key, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_shipment(receive)
    test_condition = (len([x for x in response['errors'] if x['error_field'] == key]) == 1)
    self.assertTrue(response['success'] == False and test_condition,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

# required: active, qty,
# foreign keys (required): item, shipment, user
# optional: expiration, lot_num, unit_price
class Testitemlot(TestCase):
    def setUp(self):
        self.supplier = Location.objects.filter(location_type="S")[0]
        clinics = Location.objects.filter(location_type="C")
        self.clinic = clinics[0]
        self.clinic_b = clinics[1]
        self.user = User.objects.all()[0]
        d = Item(name="Test item",user=self.user)
        d.save()
        s = Shipment(active=True,from_location=self.supplier,to_location=self.clinic,name="test supplier id",shipment_type="R",user=self.user)
        s.save()
        self.item = Item.objects.all()[0]
        self.shipment = Shipment.objects.all()[0]
        self.base_itemlot = {'active' : True, 'qty' : 23, 'item' : self.item.id, 'shipment' : self.shipment.id, 'user' : self.user.id, 'expiration' : '01/09/14', 'lot_num' : "test lot 213", 'unit_price' : 12.3}

    def test_valid_add_itemlot(self):
        itemlot_test_valid_helper(self,self.base_itemlot)
        itemlot_test_valid_helper(self,self.base_itemlot,"active",False)
        itemlot_test_valid_helper(self,self.base_itemlot,"expiration","")
        itemlot_test_valid_helper(self,self.base_itemlot,"lot_num","")
        itemlot_test_valid_helper(self,self.base_itemlot,"lot_num","2q3r;qg224g")
        itemlot_test_valid_helper(self,self.base_itemlot,"unit_price","")
        itemlot_test_valid_helper(self,self.base_itemlot,"qty",10)
        itemlot_test_valid_helper(self,self.base_itemlot,"unit_price",1000)

    def test_invalid_add_itemlot(self):
        itemlot_test_invalid_helper(self,self.base_itemlot,"active","")
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty","")
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty",-1)
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty",1.2)
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty",.2)
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty",0)
        itemlot_test_invalid_helper(self,self.base_itemlot,"qty","asdf")
        itemlot_test_invalid_helper(self,self.base_itemlot,"unit_price","asdf")
        itemlot_test_invalid_helper(self,self.base_itemlot,"unit_price",-10)
        itemlot_test_invalid_helper(self,self.base_itemlot,"item","")
        itemlot_test_invalid_helper(self,self.base_itemlot,"user","")
        itemlot_test_invalid_helper(self,self.base_itemlot,"expiration","70/02/02")

def itemlot_test_valid_helper(self, base_obj, key=None, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_itemlot(receive)
    self.assertTrue(response['success'] == True,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

def itemlot_test_invalid_helper(self, base_obj, key, value=None):
    # receive has no date
    receive = copy(base_obj)
    receive[key] = value
    response = controller.update_itemlot(receive)
    test_condition = (len([x for x in response['errors'] if x['error_field'] == key]) == 1)
    self.assertTrue(response['success'] == False and test_condition,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))


class TestStockchange(TestCase):
    def setUp(self):
        self.supplier = Location.objects.filter(location_type="S")[0]
        clinics = Location.objects.filter(location_type="C")
        self.clinic = clinics[0]
        self.clinic_b = clinics[1]
        self.user = User.objects.all()[0]
        d = Item(name="Test item",user=self.user)
        d.save()
        s = Shipment(active=True,from_location=self.supplier,to_location=self.clinic,name="test supplier id",shipment_type="R",user=self.user)
        s.save()
        self.item = Item.objects.all()[0]
        self.shipment = Shipment.objects.all()[0]
        self.baseitem_lot = controller.update_itemlot({'active' : True, 'qty' : 23, 'item' : self.item.id, 'shipment' : self.shipment.id, 'user' : self.user.id, 'expiration' : '01/09/14', 'lot_num' : "test lot 213", 'unit_price' : 12.3})['itemlot']
        self.base_stockchange = {'active' : True, 'qty' : 50, 'date' : '16/07/13', 'change_type' : 'M', 'user' : self.user.id, 'location' : self.clinic.id, 'itemlot' : self.baseitem_lot, 'note' : "test note", 'shipment' : ""}
        self.base_stockchange_dispense = {'active' : True, 'qty' : -50, 'date' : '16/07/13', 'change_type' : 'D', 'user' : self.user.id, 'location' : self.clinic.id, 'itemlot' : self.baseitem_lot, 'note' : "test note", 'shipment' : ""}
        self.base_stockchange_transfer = {'active' : True, 'qty' : 50, 'date' : '16/07/13', 'change_type' : 'T', 'user' : self.user.id, 'location' : self.clinic.id, 'itemlot' : self.baseitem_lot, 'note' : "test note", 'shipment' : self.shipment.id}

    def test_valid_add_stockchange(self):
        stockchange_test_valid_helper(self,self.base_stockchange)
        stockchange_test_valid_helper(self,self.base_stockchange_dispense)
        stockchange_test_valid_helper(self,self.base_stockchange_transfer)
        stockchange_test_valid_helper(self,self.base_stockchange,"active",False)
        stockchange_test_valid_helper(self,self.base_stockchange,"qty",10)
        stockchange_test_valid_helper(self,self.base_stockchange,"qty",-4)
        stockchange_test_valid_helper(self,self.base_stockchange,"note","")
        stockchange_test_valid_helper(self,self.base_stockchange,"date","07/01/13")

    def test_invalid_add_stockchange(self):
        stockchange_test_invalid_helper(self,self.base_stockchange,"active","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"qty","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"qty",.1)
        stockchange_test_invalid_helper(self,self.base_stockchange,"qty",3.1)
        stockchange_test_invalid_helper(self,self.base_stockchange,"qty",0)
        stockchange_test_invalid_helper(self,self.base_stockchange,"qty","asdf")
        stockchange_test_invalid_helper(self,self.base_stockchange,"date","071/13")
        stockchange_test_invalid_helper(self,self.base_stockchange,"date","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"user","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"location","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"itemlot","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"shipment","sd")
        stockchange_test_invalid_helper(self,self.base_stockchange,"shipment",self.shipment.id)
        stockchange_test_invalid_helper(self,self.base_stockchange_dispense,"shipment",self.shipment.id)
        stockchange_test_invalid_helper(self,self.base_stockchange_dispense,"qty",8)
        stockchange_test_valid_helper(self,self.base_stockchange_transfer, "shipment","")
        stockchange_test_invalid_helper(self,self.base_stockchange,"user","")

def stockchange_test_valid_helper(self, base_obj, key=None, value=None):
    receive = copy(base_obj)
    receive[key] = value
    response = controller.add_stockchange(receive)
    self.assertTrue(response['success'] == True,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))

def stockchange_test_invalid_helper(self, base_obj, key, value=None):
    receive = copy(base_obj)
    receive[key] = value
    response = controller.add_stockchange(receive)
    test_condition = (len([x for x in response['errors'] if x['error_field'] == key]) == 1)
    self.assertTrue(response['success'] == False and test_condition,'\n\nINPUT: ' + str(receive) + '\n\nRESPONSE: ' + str(response))