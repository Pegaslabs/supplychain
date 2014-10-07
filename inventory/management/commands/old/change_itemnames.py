from django.core.management.base import BaseCommand, CommandError
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute
import sys

class Command(BaseCommand):
    args = '<filepath>'
    help = 'imports a tab separated list of item names: "olditemn \t newitem"'

    def handle(self, *args, **options):
        f = open(args[0])
        counter = 0
        for line in f:
            item_attrs = line.split("\t")
            # d = Item.objects.filter(name=item_attrs[0])
            # if len(d) > 1:
            #     print " " + str(len(d)) +" items found for item " + item_attrs[0]
            # if len(d) < 1:
            #     d = Item.objects.filter(name=" ".join(item_attrs[0].split()))
            #     if len(d) > 1:
            #         print " " + str(len(d)) +" items found " + item_attrs[0]
            #     if len(d) < 1:
            #         print "item not found " + item_attrs[0]
            # # if len(d) == 1:
            # #     print "found " + item_attrs[0]

            try:
                d = Item.objects.get(name=item_attrs[0])
            except:
                try:
                    d = Item.objects.get(name=" ".join(item_attrs[0].split()))
                except:
                    print 'no item found'
            d.name = " ".join(item_attrs[1].split())
            d.save()
            a = ItemAttribute()
            a.item=d
            a.attribute="alt_name"
            a.value=item_attrs[0]
            a.user = d.user
            a.save()
            counter = counter + 1
            print "item named " + item_attrs[0] + " was renamed to " + d.name
        #     except:
        #         try:
        #             d_name = " ".join(item_attrs[0].split())
        #             d = Item.objects.get(name=d_name)
        #             d.name = " ".join(item_attrs[1].split())
        #             d.save()
        #             a = ItemAttribute()
        #             a.item=d
        #             a.attribute="alt_name"
        #             a.value=item_attrs[0]
        #             a.user = item.user
        #             a.save()
        #             print "item named " + item_attrs[0] + " was renamed to " + d.name
        #             counter = counter + 1
        #         except:
        #             print "item named " + item_attrs[0] + " was not found."
        print " " + str(counter) + " items renamed."