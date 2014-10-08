from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute

class Command(BaseCommand):
	# problems: find itemlots with more than two stock changes on the same shipment
	ss = Shipment.objects.filter(shipment_type="T",active=True)
	for s in ss:
		da_hash = {}
		for sc in s.stockchange_set.filter(active=True):
			da = sc.itemlot.id
			item_id = sc.itemlot.item.id
			if da in da_hash:
				da_hash[da]['stockchanges'].append(sc.id)
			else:
				da_hash[da] = {}
				da_hash[da]['stockchanges'] = []
				da_hash[da]['stockchanges'].append(sc.id)
				da_hash[da]['item_id'] = item_id
		for key,value in da_hash.iteritems():
			if len(value['stockchanges']) < 2:
				print 'http://localhost:8000/1/shipment/send/%s/' % s.id
				print 'http://localhost:8000/1/bin/%s/' % value['item_id']
				for sy in value['stockchanges']:
					print 'http://localhost:8000/admin/inventory/stockchange/%s/' % sy, StockChange.objects.get(id=sy)
			elif len(value['stockchanges']) < 2:
				print 'http://localhost:8000/1/shipment/send/%s/' % s.id
				print 'http://localhost:8000/1/bin/%s/' % value['item_id']
				for sy in value['stockchanges']:
					print 'http://localhost:8000/admin/inventory/stockchange/%s/' % sy



	# problems: find active shipments with inactive stockchanges or itemlots
	# problems: find inactive shipments with active stockchanges or itemlots
	# problems: find stock cards with item lotes that don't add up

