# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    # fix new line item lots, leading / trailing spaces
    i = Item.objects.get(id=708)
    i.name = i.name.strip()
    i.save()
    ils = ItemLot.objects.filter(lot_num=" \n")
    for il in ils:
        print "removing new line lot Num for ",il
        il.lot_num = None
        il.save()
    today = timezone.localtime(timezone.now())
    u = User.objects.get(username="system")
    try:
        expired_location = Location.objects.get(name="Expired")
    except:
        expired_location = Location(name="Expired",user=u,location_type="V")
        expired_location.save()
    u = User.objects.all()[0]
    # clean out old expired stockchanges
    for sc in StockChange.objects.filter(change_type="E"):
        print "deleting sc ",sc
        sc.delete()
    for il in ItemLot.objects.filter(active=True):
        if il.expiration:
            # correct old expirations 
            e = timezone.localtime(il.expiration)
            il.expiration = e.replace(hour=0)
            il.expiration = e.replace(minute=0)
            il.expiration = e.replace(second=0)
            il.expiration = e.replace(microsecond=0)
            il.save()
            if e < today:
                # add an expired entry in every location that has a stock balance
                for location in Location.objects.filter(location_type__in="I,D"):
                    curr_qty = il.soh(location=location,date=il.expiration)
                    if curr_qty > 0:
                        e_shipment_name = "Automated Expired Items Move "+ str(e.day) + "-" + str(e.month) + "-" + str(e.year) + " at " + location.name
                        try:
                          shipment = Shipment.objects.get(name=e_shipment_name)
                          print "FOUND existing shipment ", shipment
                        except:
                          shipment = Shipment(name=e_shipment_name,to_location=expired_location,from_location=location,date=il.expiration,shipment_type="T",active=True,user=u)
                          shipment.save()
                          print "CREATED new shipment",shipment
                        s = StockChange(active=True,qty=(-curr_qty),location=location,date=il.expiration,itemlot=il,shipment=shipment,change_type="T",user=u)
                        s.save()
                        s = StockChange(active=True,qty=curr_qty,location=expired_location,date=il.expiration,shipment=shipment,itemlot=il,change_type="T",user=u)
                        s.save()
                        print "created stock change ",s
                il.expired = True
                il.save()
                print "marked ",il,"expired"
    print "CORRECTING STOCKCHANGES WITHOUT SHIPMENTS"
    scs = StockChange.objects.filter(shipment=None)
    u = User.objects.get(username="system")
    for sc in scs:
        try:
            l = Location.objects.get(name=sc.get_change_type_display())
        except:
            l = Location(name=sc.get_change_type_display(),user=u,location_type="V")
            l.save()
        n = sc.get_change_type_display() + " Report at " + sc.location.name + " " + str(timezone.localtime(sc.date)).split("00")[0]
        try:
            s = Shipment.objects.get(name=n)
        except:
            s = Shipment(name=n,date=sc.date,user=u,to_location=l,from_location=sc.location,shipment_type="T",active=True)
            s.save()
        sc.shipment=s
        sc.change_type = "T"
        sc.save()
        # second stockchange at virtual location
        new_sc = StockChange(user=u,change_type="T",shipment=s,qty=-1*sc.qty,location=l,active=True,itemlot=sc.itemlot,date=sc.date)
        new_sc.save()
        print sc,sc.id
        print new_sc,new_sc.id



