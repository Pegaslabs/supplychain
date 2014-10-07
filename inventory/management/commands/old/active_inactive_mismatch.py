from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
import pytz
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
	# problems: find active shipments with inactive stockchanges
	for s in Shipment.objects.filter(active=True):
		scs = s.stockchange_set.filter(active=False)
		if len(scs) > 0:
			print 'http://localhost:8000/admin/inventory/shipment/%s/' % s.id
			for sc in scs:
				print "http://localhost:8000/admin/inventory/stockchange/%s/" % sc.id
	# problems: find inactive shipments with active stockchanges
	for s in Shipment.objects.filter(active=False):
		scs = s.stockchange_set.filter(active=True)
		if len(scs) > 0:
			print 'http://localhost:8000/admin/inventory/shipment/%s/' % s.id
			for sc in scs:
				print "http://localhost:8000/admin/inventory/stockchange/%s/" % sc.id

	# problems: find active shipments with inactive itemlots
	for s in Shipment.objects.filter(active=True):
		scs = s.itemlot_set.filter(active=False)
		if len(scs) > 0:
			print 'http://localhost:8000/admin/inventory/shipment/%s/' % s.id
			for sc in scs:
				print "http://localhost:8000/admin/inventory/stockchange/%s/" % sc.id

	# problems: find inactive shipments with active itemlots
	for s in Shipment.objects.filter(active=True):
		scs = s.itemlot_set.filter(active=False)
		if len(scs) > 0:
			print 'http://localhost:8000/admin/inventory/shipment/%s/' % s.id
			for sc in scs:
				print "http://localhost:8000/admin/inventory/stockchange/%s/" % sc.id
	# problems: find stock cards with item lotes that don't add up

