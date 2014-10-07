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
  # need to remove active from sc level!! temp fix!!
  for s in Shipment.objects.filter(active=True):
    for sc in s.stockchange_set.filter(active=False):
      print "updating sc " + str(sc)
      sc.active = True
      sc.save()