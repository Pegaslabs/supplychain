from django.db import models
from django.contrib.auth.models import User
from inventory.models import Location

class UserPreferences(models.Model):
    def __unicode__(self):
    	return self.user.username + " preferences: default location " + self.default_location.name
    user = models.ForeignKey(User)
    default_location = models.ForeignKey(Location)
    default_to_location = models.ForeignKey(Location,related_name='default_to_location_set')
