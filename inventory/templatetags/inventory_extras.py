from django import template

register = template.Library()

@register.filter
def get_soh(obj, location):
    return obj.soh(location)

@register.filter
def get_soh(obj, location):
    return obj.soh(location)

@register.filter
def get_soh(obj, item):
    return obj.soh(item)