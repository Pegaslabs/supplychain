# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    for location in Location.objects.filter(name=""):
    	print location.id