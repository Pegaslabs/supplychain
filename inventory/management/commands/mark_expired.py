# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    today = timezone.localtime(timezone.now())
    expired_location = Location.objects.get(name="Expired")
    u = User.objects.all()[0]
    for il in ItemLot.objects.filter(active=True,expired=False):
        if il.expiration:
            e = timezone.localtime(il.expiration)
            if e < today:
                # add an expired entry in every location that has a stock balance
                for location in Location.objects.filter(location_type__in="I,D"):
                    curr_qty = il.soh(location=location,date=today)
                    if curr_qty > 0:
                        e_shipment_name = "Automated Expired Items Move "+ str(e.day) + "-" + str(e.month) + "-" + str(e.year) + " at " + location.name
                        try:
                          shipment = Shipment.objects.get(name=e_shipment_name)
                          # print "FOUND existing shipment ", shipment
                        except:
                          shipment = Shipment(name=e_shipment_name,to_location=expired_location,from_location=location,date=il.expiration,shipment_type="T",active=True,user=u)
                          shipment.save()
                          # print "CREATED new shipment",shipment
                        s = StockChange(active=True,qty=(-curr_qty),location=location,date=il.expiration,itemlot=il,shipment=shipment,change_type="T",user=u)
                        s.save()
                        s = StockChange(active=True,qty=curr_qty,location=expired_location,date=il.expiration,shipment=shipment,itemlot=il,change_type="T",user=u)
                        s.save()
                        # print "created stock change ",s
                il.expired = True
                il.save()
                print "marked ",il,il.expiration,"expired"