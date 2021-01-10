"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include             
from rest_framework import routers                  
from main import views   
from django.conf import settings
from django.conf.urls import url,static
from django.views.decorators.csrf import csrf_exempt
# from django.views.generic import TemplateView

from .views import hello
from main.views import RecipeItemView, crawl

app_name = 'dog-ear-server'
# websocket = path
router = routers.DefaultRouter()                
router.register(r'recipes', RecipeItemView, 'recipe') 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('hello/', csrf_exempt(hello), name='hello'),
    url('crawl/', csrf_exempt(crawl), name='crawl'),
    # url(r'^api/recipes/', csrf_exempt(recipes), name='recipes'),
    # url(r'^api/delete/', csrf_exempt(delete), name='delete'),
]

