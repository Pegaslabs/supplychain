# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
import pytz
from django.utils.dateparse import parse_datetime
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute
from tempfile import mkstemp
from shutil import move
from os import remove, close

class Command(BaseCommand):
  for item in Item.objects.all():
    a = item.itemlot_set.all()
    if len(a) > 1:
      for il in a:
        e = str(il.expiration.year) + "-" + str (il.expiration.month) + "-" + str(il.expiration.day) if il.expiration else ""
        print il.shipment.from_location.name, "\t", e, "\t", il, "\t", il.unit_price
