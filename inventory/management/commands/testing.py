# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    # item = Item.objects.get(id=374)
    itemlots = ItemLot.objects.filter(item__id=372)
    l = Location.objects.get(id=1)
    for i in itemlots:
    	print i.unit_price,"\t",i.soh(l,"2014-10-31")