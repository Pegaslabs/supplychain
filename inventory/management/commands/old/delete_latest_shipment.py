# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from inventory.models import Shipment

class Command(BaseCommand):
  s = Shipment.objects.all().order_by("-id")[0]
  if "Test" in s.to_location.name:
    s.delete()
    print "deleted shipment " + str(s)