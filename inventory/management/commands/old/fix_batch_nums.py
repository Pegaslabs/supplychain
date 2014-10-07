# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
import pytz
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    for il in ItemLot.objects.all():
        print "asdf",il.lot_num,"Asdf"
        if il.lot_num:
            if il.lot_num.isspace():
                print "asdf"
                il.lot_num = None
                il.save()
                # print il
