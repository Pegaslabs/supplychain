# This Python file uses the following encoding: utf-8

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient

class Command(BaseCommand):
    l = Location.objects.filter(name__icontains="ND").exclude(location_type="P").order_by('name')
    print len(l)
    print "sweet"
