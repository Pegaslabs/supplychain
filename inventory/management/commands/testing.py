# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    # print "yeah"
    too_old_shipment = Shipment.objects.get(date__lt="2000-01-01")
    too_old_shipment.delete()
    # print s.active
    # for sc in s:
    #   print sc.item, sc.qty
    # # sc = StockChange.objects.get(id=266507)
    # # sc.delete()

    # from django.utils import timezone
    # import datetime
    # timezone.now()
    # d = datetime.datetime(2015, 9, 18, 0, 0, 0, 0,tzutc())
    # s.date= d
    # print ss
    # s.delete()
    # s.save()