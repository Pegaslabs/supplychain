from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
import math
import pytz
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
    for sc in StockChange.objects.filter(change_type='E',active=True):
        exit(1)
    for sc in StockChange.objects.filter(change_type='E',active=False):
        sc.delete()
    for da in ItemLot.objects.filter(expired=True):
        da.expired=False
    # controller.mark_expired()