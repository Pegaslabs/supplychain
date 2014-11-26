from django.contrib import admin
from inventory.models import Location
from accounts.models import UserPreferences

class UserPreferencesAdmin(admin.ModelAdmin):
	fields = ['user',  'default_location', 'default_dispensary']

admin.site.register(UserPreferences, UserPreferencesAdmin)
