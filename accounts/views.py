import simplejson as json
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response, redirect
from accounts.models import UserPreferences

# errors:
# EMAIL email isn't tied to account
# PASSWORD password isn't correct

def signin(request):
    response = {}
    response['success'] = False
    args = json.loads(request.body)
    username =  args['username']
    password = args['password']
    if (len(User.objects.filter(username=username)) < 1):
        # email doesn't exist
        return HttpResponse(json.dumps(response), mimetype='application/json')
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            response['success'] = True
            # success!
            return HttpResponse(json.dumps(response), mimetype='application/json')
    # password didn't match
    return HttpResponse(json.dumps(response), mimetype='application/json')

def user_config(request):
    if not request.user.is_authenticated():
        return redirect('/admin/')
    response = {'success' : True, "data" : {}}
    try:
        response['data']['default_location'] = UserPreferences.objects.get(user=request.user).default_location.id
    except:
        pass
    return HttpResponse(json.dumps(response), mimetype='application/json')

def signout(request):
    logout(request)
    return redirect('/')