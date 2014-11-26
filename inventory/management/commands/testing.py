# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    s = Shipment.objects.filter(date__lte="2000-01-01")
    for se in s:
    	print se