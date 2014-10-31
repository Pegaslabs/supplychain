# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    for ship in Shipment.objects.all():
        scs = ship.stockchange_set.all()
        for sc in scs:
            scitemlots = scs.filter(itemlot=sc.itemlot)
            if scitemlots.aggregate(Sum('qty'))['qty__sum'] is not 0:
                scpositives = scitemlots.filter(qty__gt=0)
                if len(scpositives) > 1:
                    for messedsc in scpositives[1:]:
                        scpositives[0].qty += messedsc.qty
                        messedsc.delete()
                        scpositives[0].save()
                scnegatives = scitemlots.filter(qty__lt=0)
                # take out all the negatives and rebuild
                for neg in scnegatives:
                    neg.delete()
                if sc.location.id is ship.to_location.id:
                    opp_loc = ship.from_location
                else:
                    opp_loc = ship.to_location
                if len(scpositives) > 1:
                    newnegsc = StockChange(itemlot=scpositives[0].itemlot,shipment=ship,qty=-1*scpositives[0].qty,location=opp_loc,change_type='T',date=ship.date,user=ship.user)
                else:
                    newnegsc = StockChange(itemlot=sc.itemlot,shipment=ship,qty=-1*sc.qty,location=opp_loc,change_type='T',date=ship.date,user=ship.user)
                newnegsc.save()

    for ship in Shipment.objects.all():
        sumoqty = ship.stockchange_set.aggregate(Sum('qty'))
        if (sumoqty['qty__sum'] is not 0):
            print ship.id,sumoqty['qty__sum'], len(ship.stockchange_set.all()) 
