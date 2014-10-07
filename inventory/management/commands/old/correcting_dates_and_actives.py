from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
import pytz
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    stockchanges = StockChange.objects.filter(active=False,shipment__active=True)
    print 'getting all inactive stock changes with active shipments'
    for sc in stockchanges:
        print 'http://localhost:8000/' + str(sc.location.id) + '/bin/' + str(sc.itemlot.item.id) + "/"
        sc.active = True
        sc.save()
    stockchanges = StockChange.objects.filter(active=False,shipment__active=True)
    if len(stockchanges) > 0:
        print 'fail!!'
        for sc in stockchanges:
            print 'http://localhost:8000/' + str(sc.location.id) + '/bin/' + str(sc.itemlot.item.id) + "/"

    print "correcting all same day same time dates"
    utc = pytz.timezone("UTC")
    for d in Item.objects.all():
        for da in d.itemlot_set.all():
            for sc in da.stockchange_set.all():
                same_time_scs = StockChange.objects.filter(itemlot__item=d,date=sc.date,location=sc.location)
                if len(same_time_scs) > 1:
                    print 'http://localhost:8000/' + str(sc.location.id) + '/bin/' + str(sc.itemlot.item.id) + "/"
                    print "has..."
                    same_day_scs = StockChange.objects.filter(itemlot__item=d,date__year=sc.date.year,date__month=sc.date.month,date__day=sc.date.day,location=sc.location).order_by('date')
                    counter = 1
                    for same_time_sc in same_time_scs:
                        print same_time_sc
                        same_time_sc.date = same_time_sc.date.replace(microsecond=same_day_scs[len(same_day_scs)-1].date.microsecond+counter)
                        same_time_sc.save()
                        print counter
                        counter = counter + 1