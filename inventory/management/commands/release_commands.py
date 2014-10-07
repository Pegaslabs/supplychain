# This Python file uses the following encoding: utf-8

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient

class Command(BaseCommand):
    print "Correcting missing create timestamp on patients:"
    for p in Patient.objects.filter(created=None):
        print p
        p.created = p.modified
        p.save()

    print "Correcting missing create timestamp on item lots:"
    for il in ItemLot.objects.filter(created=None):
        print il
        il.created = il.modified
        il.save()

    print "moving patient name up into location name for patients and locations:"
    for patient in Patient.objects.all():
        if patient.location.name != patient.name:
            print patient.location.id,patient.location.name,"<<<",patient.id,patient.name,patient.identifier
            patient.location.name = patient.name
            patient.location.save()
