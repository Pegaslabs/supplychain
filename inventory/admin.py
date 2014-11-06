from django.contrib import admin
from inventory.models import Item, ItemCategory, ItemAttribute, ItemLot, ItemLotAttribute, StockChange, Shipment, Location, District, Patient, PhysicalInventory

class ItemAdmin(admin.ModelAdmin):
	fields = ['name', 'dispense_size',  'modified', 'category', 'user']
class ItemCategoryAdmin(admin.ModelAdmin):
	fields = ['name',  'modified', 'user']
class ItemAttributeAdmin(admin.ModelAdmin):
	fields = ['item', 'attribute', 'value', 'modified', 'user']
class ItemLotAdmin(admin.ModelAdmin):
	fields = ['item', 'expiration', 'active', 'lot_num', 'qty', 'unit_price', 'shipment',  'modified', 'user']
class ItemLotAttributeAdmin(admin.ModelAdmin):
	fields = ['itemlot', 'attribute', 'value', 'modified', 'user']
class StockChangeAdmin(admin.ModelAdmin):
	readonly_fields = ('created',)
	fields = ['qty', 'location', 'date', 'active', 'shipment', 'itemlot', 'change_type', 'note',  'modified', 'user']
class ShipmentAdmin(admin.ModelAdmin):
	fields = ['from_location', 'to_location', 'active', 'name', 'date', 'shipment_type',  'modified', 'user']
class LocationAdmin(admin.ModelAdmin):
	fields = ['name', 'location_type',  'modified', 'user']
class DistrictAdmin(admin.ModelAdmin):
    fields = ['name',  'modified', 'user']
class PatientAdmin(admin.ModelAdmin):
    fields = ['identifier', 'district', 'dob', 'gender', 'location',  'modified', 'user']
class PhysicalInventoryAdmin(admin.ModelAdmin):
	fields = ['location', 'date', 'debits_shipment', 'credits_shipment', 'modified', 'user','line_items']

admin.site.register(Item, ItemAdmin)
admin.site.register(ItemCategory, ItemCategoryAdmin)
admin.site.register(ItemAttribute, ItemAttributeAdmin)
admin.site.register(ItemLot, ItemLotAdmin)
admin.site.register(ItemLotAttribute, ItemLotAttributeAdmin)
admin.site.register(StockChange, StockChangeAdmin)
admin.site.register(Shipment, ShipmentAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(PhysicalInventory, PhysicalInventoryAdmin)
