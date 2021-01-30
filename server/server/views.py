from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
# from django.shortcuts import render


def hello(request):
    return JsonResponse({'response_text':'hello world!'})

# Serve Single Page Application
index = never_cache(TemplateView.as_view(template_name='index.html'))