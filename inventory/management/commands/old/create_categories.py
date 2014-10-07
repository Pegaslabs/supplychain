from django.core.management.base import BaseCommand, CommandError
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute, ItemCategory
from django.contrib.auth.models import User

class Command(BaseCommand):
    args = '<filepath>'
    help = 'takes all the itemattributes named mgmt_group and puts them into categories'

    def handle(self, *args, **options):
        items = Item.objects.all()
        counter = 0
        for item in items:
        	das = ItemAttribute.objects.filter(item=item,attribute='mgmt_group')
        	if len(das) > 1:
        		print "WARNING " + item.name + " " + str(item.id) + " has more than one attribute "
        		for da in das:
        			print da
        	elif len(das) < 1:
        		print "OOPS " + item.name + " " + str(item.id) + " has no mgmt_group"
        		counter = counter +1
        	else:
        		dcs = ItemCategory.objects.filter(name=das[0].value)
        		if len(dcs) < 1:
        			dc = ItemCategory(name=das[0].value)
        			dc.user = User.objects.get(username="system")
        			dc.save()
        		else:
        			dc = dcs[0]
        		item.category = dc
        		item.save()
        		print "will create itemcategory " + item.category.name + " for item " + item.name
        print str(counter) + " items have no mgmt groups out of " + str(len(items)) + " items"