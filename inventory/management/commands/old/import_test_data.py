# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
import httplib
from django.db.models import Q
from datetime import datetime,timedelta
import pytz
from django.utils.dateparse import parse_datetime
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemCategory, ItemLot, StockChange, Shipment,Location, ItemAttribute
from tempfile import mkstemp
from shutil import move
from os import remove, close

class Command(BaseCommand):
  httpServ = httplib.HTTPConnection("localhost", 8000)
  httpServ.connect()

  httpServ.request('GET', "/#/reports")

  response = httpServ.getresponse()
  if response.status == httplib.OK:
      printText (response.read())

  # test_shipment_1_date = "2013-01-01"
  # test_shipment_2_date = "2013-01-02"
  # user = User.objects.get(id=1)
  # try:
  #   test_warehouse = Location.objects.get(name="Test Warehouse")
  #   print "Found",test_warehouse
  # except:
  #   test_warehouse = Location(name="Test Warehouse",user=user,location_type="I")
  #   test_warehouse.save()
  #   print "Created",test_warehouse
  # try:
  #   test_supplier = Location.objects.get(name="Test Supplier")
  #   print "Found",test_supplier
  # except:
  #   test_supplier = Location(name="Test Supplier",user=user,location_type="S")
  #   test_supplier.save()
  #   print "Created",test_supplier
  # try:
  #   test_shipment_1 = Shipment.objects.get(from_location=test_supplier,
  #     to_location=test_warehouse,date=test_shipment_1_date,user=user,
  #     shipment_type="R")
  #   print "Found",test_shipment_1
  #   # test_shipment_1.delete()
  # except:
  #   test_shipment_1 = Shipment(from_location=test_supplier,
  #     to_location=test_warehouse,date=test_shipment_1_date,active=True,
  #     user=user,shipment_type="R")
  #   test_shipment_1.save()
  #   print "Created",test_shipment_1
  #   try:
  #     test_item_category = ItemCategory.objects.get(name="Test Item Category",user=user)
  #     print "Found ", test_item_category
  #   except:
  #     test_item_category = ItemCategory(name="Test Item Category",user=user)
  #     test_item_category.save()
  #     print "Created ", test_item_category
  #   try:
  #     test_item = Item.objects.get(name="Test Consumption Report Item")
  #     print "Found ", test_item
  #   except:
  #     test_item = Item(name="Test Consumption Report Item",category=test_item_category,user=user)
  #     test_item.save()
  #     print "Created ", test_item
  #   test_itemlot = ItemLot(user=user,shipment=test_shipment_1,qty=40,item=test_item,expiration="2018-01-01",lot_num="test lot number",unit_price=15,active=True)
  #   test_itemlot.save()
  #   print "Created",test_itemlot
  #   sc = StockChange(user=user,location=test_warehouse,qty=40,itemlot=test_itemlot,date=test_shipment_1.date,change_type="T",shipment=test_shipment_1,active=True)
  #   sc.save()
  #   print "Created",sc
  #   test_itemlot_2 = ItemLot(user=user,shipment=test_shipment_1,qty=10,item=test_item,expiration="2013-01-15",lot_num="test lot expiring",unit_price=15,active=True)
  #   test_itemlot_2.save()
  #   print "Created",test_itemlot_2
  #   sc = StockChange(user=user,location=test_warehouse,qty=10,itemlot=test_itemlot_2,date=test_shipment_1.date,change_type="T",shipment=test_shipment_1,active=True)
  #   sc.save()
  #   print "Created",sc

  # try:
  #   test_clinic = Location.objects.get(name="Test Clinic")
  # except:
  #   test_clinic = Location(user=user,name="Test Clinic",location_type="I")
  #   test_clinic.save()
  # try:
  #   test_shipment_2 = Shipment.objects.get(
  #     from_location=test_warehouse,
  #     to_location=test_clinic,
  #     date=test_shipment_2_date,
  #     user=user,
  #     shipment_type="T")
  #   print "Found",test_shipment_2
  #   # test_shipment_1.delete()
  # except:
  #   test_shipment_2 = Shipment(from_location=test_warehouse,
  #     to_location=test_clinic,
  #     date=test_shipment_2_date,
  #     active=True,
  #     user=user,shipment_type="T")
  #   test_shipment_2.save()
  #   print "Created",test_shipment_2
  #   sc = StockChange(user=user,location=test_warehouse,qty=-5,itemlot=test_itemlot,date=test_shipment_2.date,change_type="T",shipment=test_shipment_2,active=True)
  #   print "Created",sc
  #   sc = StockChange(user=user,location=test_clinic,qty=5,itemlot=test_itemlot,date=test_shipment_2.date,change_type="T",shipment=test_shipment_2,active=True)
  #   sc.save()
  #   print "Created",sc



