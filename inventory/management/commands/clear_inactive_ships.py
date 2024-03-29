# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    for ship in Shipment.objects.filter(from_location__location_type="D",active=False):
    	if ship.item_count() == 0:
    		ship.delete()