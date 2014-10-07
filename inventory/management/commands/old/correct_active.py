from django.utils import timezone
from django.core.management.base import BaseCommand, CommandError
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute, ItemCategory
from django.contrib.auth.models import User

class Command(BaseCommand):
    args = ''
    help = 'corrects a bug where active shipments getting edited did not also activate itemlots and stockchanges'

    def handle(self, *args, **options):
        shipments = Shipment.objects.all()
        for shipment in shipments:
            if shipment.active:
            	for da in shipment.itemlot_set.filter(active=False):
            		da.active = True
            		da.save()
            	for sc in shipment.stockchange_set.filter(active=False):
            		sc.active = True
            		sc.save()
