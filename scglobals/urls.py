from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView, DetailView
from inventory.api import UserResource,ItemCategoryResource,ItemResource,LocationResource,ShipmentResource,ItemLotResource,ItemLotAttributeResource,StockChangeResource,UserPreferencesResource,PatientResource,DistrictResource,SearchResource,PhysicalInventoryResource
from tastypie.api import Api

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(UserPreferencesResource())
v1_api.register(ItemCategoryResource())
v1_api.register(ItemResource())
v1_api.register(LocationResource())
v1_api.register(ShipmentResource())
v1_api.register(ItemLotResource())
v1_api.register(ItemLotAttributeResource())
v1_api.register(StockChangeResource())
v1_api.register(PatientResource())
v1_api.register(DistrictResource())
v1_api.register(SearchResource())
v1_api.register(PhysicalInventoryResource())

urlpatterns = patterns('',

    # html
    url(r'^$', 'inventory.views.home'),
    url(r'sc', 'inventory.views.sc'),
    url(r'report.json', 'inventory.views.report'),
    url(r'stockchanges.json', 'inventory.views.stockchanges'),
    url(r'shipments.json', 'inventory.views.shipments'),

    url(r'^print/shipment/(?P<pk>\d+)/$', 'inventory.views.print_shipment'),

    # admin/accounts
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/signin/$', 'accounts.views.signin'),
    url(r'^accounts/signout/$', 'accounts.views.signout'),

    # tastypie api
    (r'^api/', include(v1_api.urls)),

)
