import os
import logging
from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView, View
# from django.views.decorators.cache import never_cache
from django.conf import settings
# from django.shortcuts import render


def hello(request):
    return JsonResponse({'response_text':'hello world!'})

# Serve Single Page Application
class FrontendAppView(View):

    index_file_path = os.path.join(settings.FRONTEND_DIR, 'build', 'index.html')
    # print("------index------", index_file_path)
    def get(self, request):
        try:
            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead after
                running `yarn start` on the frontend/ directory
                """,
                status=501,
            )
# index = never_cache(TemplateView.as_view(template_name='index.html'))