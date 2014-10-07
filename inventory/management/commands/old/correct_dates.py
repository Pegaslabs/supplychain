from django.utils import timezone
from django.core.management.base import BaseCommand, CommandError
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute, ItemCategory
from django.contrib.auth.models import User

class Command(BaseCommand):
    args = ''
    help = 'finds all stock changes that have shipments and makes their dates equal to that of their shipments'

    def handle(self, *args, **options):
        # pass
        # obsolete, fixed dates. see "same day changes"
        # shipments = Shipment.objects.all()
        for shipment in shipments:
            shipment.date = timezone.localtime(shipment.date).replace(hour=0)
            shipment.date = timezone.localtime(shipment.date).replace(minute=0)
            shipment.date = timezone.localtime(shipment.date).replace(second=0)
            shipment.date = timezone.localtime(shipment.date).replace(microsecond=0)
            shipment.save()
            for sc in shipment.stockchange_set.all():
                sc.date = sc.shipment.date
                sc.save()

        # for d in Item.objects.all():
        #     scs = StockChange.objects.filter(itemlot__item=d).order_by('-date')
        #     for sc in scs:
        #         others = scs.filter(date__year=sc.date.year,date__month=sc.date.month,date__day=sc.date.day).exclude(id=sc.id).order_by('date')
        #         if len(others) > 1:
        #             sc.date = others[len(others)-1].date.replace(microsecond=others[len(others)-1].date.microsecond+1)
        #             sc.save()