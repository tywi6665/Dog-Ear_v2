from uuid import uuid4
from urllib.parse import urlparse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
# from django.views.decorators.http import require_POST, require_http_methods
# from django.shortcuts import render
from rest_framework import viewsets 
from .serializers import RecipeItemSerializer, CrawledRecipeItemSerializer
# , ImageItemSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scrapyd_api import ScrapydAPI
# from main.utils import URLUtil
from main.models import RecipeItem, CrawledRecipeItem
# , ImageItem
from django_filters import rest_framework as filters
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import json

# connect to scrapyd service
scrapyd = ScrapydAPI('http://localhost:6800')

# url validation function
def is_valid_url(url):
    validate = URLValidator()
    try:
        validate(url) # check to see if url format is valid
    except ValidationError:
        return False
    return True

# csrf security token exemption
# @csrf_exempt

# specifies accepted http methods
# @require_http_methods(['POST', 'GET'])

# api routes
class CrawledRecipeItemView(viewsets.ModelViewSet):
    authentication_classes = []
    lookup_field = 'unique_id'
    serializer_class = CrawledRecipeItemSerializer
    queryset = CrawledRecipeItem.objects.all()

class RecipeItemView(viewsets.ModelViewSet):
    authentication_classes = []
    lookup_field = 'unique_id'
    serializer_class = RecipeItemSerializer
    queryset = RecipeItem.objects.all()
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filter_fields = ['timestamp', 'rating', 'title', 'has_made']

    def create(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8')).get('data')
        print('-----POST-----', data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return JsonResponse({'Success': 'Entry Created'})

    def update(self, request, *args, **kwargs):
        print('-----PUT-----', json.loads(request.body.decode('utf-8')))
        field = json.loads(request.body.decode('utf-8')).get('field')
        print(field)
        instance = self.get_object()
        if field == 'has_made':
            instance.has_made = request.data.get('has_made')
        elif field == 'rating':
            instance.rating = request.data.get('rating')
        elif field == 'notes_add':
            new_note = request.data.get('notes')
            print(new_note)
            instance.notes.append(new_note)
            print(instance.notes)
        elif field == 'notes_remove':
            note_to_remove = request.data.get('note')
            print(note_to_remove)
            instance.notes.remove(note_to_remove)
            print(instance.notes)
        elif field == 'tags_add':
            new_tags = request.data.get('tags').split(',')
            print(new_tags)
            for tag in new_tags:
               instance.tags.append(tag) 
            print(instance.tags)
        elif field == 'tags_remove':
            tag_to_remove = request.data.get('tag')
            print(tag_to_remove)
            instance.tags.remove(tag_to_remove)
            print(instance.notes)
        elif field == 'edit_entry':
            editedEntry = request.data.get('editedEntry')
            print(editedEntry)
            instance.url = editedEntry.get('url')
            instance.title = editedEntry.get('title')
            instance.author = editedEntry.get('author')
            instance.img_src = editedEntry.get('img_src')
            instance.description = editedEntry.get('description')
            instance.has_made = editedEntry.get('has_made')
            instance.rating = editedEntry.get('rating')
            instance.notes = editedEntry.get('notes')
            instance.tags = editedEntry.get('tags')
            instance.ingredients = editedEntry.get('ingredients')
            instance.steps = editedEntry.get('steps')
            print(instance)

        instance.save()

        return JsonResponse({'Success': 'Entry Updated'})

# class imageUploadView(viewsets.ModelViewSet):
#     parser_classes = (MultiPartParser, FormParser)

#     serializer_class = ImageItemSerializer
#     queryset = ImageItem.objects.all()

#     def get(self, request, *args, **kwargs):
#         images = ImageItem.objects.all()
#         serializer = ImageItemSerializer(images, many=True)
#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         print('-----POST-----', request.data)
#         images_serializer = ImageItemSerializer(data=request.data)
#         if images_serializer.is_valid():
#             images_serializer.save()
#             return Response(images_serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             print('error', images_serializer.errors)
#             return Response(images_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# crawling function
def crawl(request):
    # POST requests == new crawling task
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    if data.get('method') == 'POST':
        # take url from client
        url = data.get('url', None)
        print("-----URL-----", url)
        # if url does not exist
        if not url:
            return JsonResponse({'error': 'Missing args'})
        # if url is not valid return error
        if not is_valid_url(url):
            return JsonResponse({'error': 'URL is invalid'})

        # parse the url and extract its domain
        domain = urlparse(url).netloc
        print("-----Domain-----", domain)
        # create a unique id
        unique_id = str(uuid4())
        # custom settings for scrapy spider
        settings = {
            'unique_id': unique_id, # unique id for each entry in DB
            'USER_AGENT': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }

        # schedule a new crawling task
        # return a id which will be used to check on the task's status
        print("-----Scheduling Crawler-----")

        task = scrapyd.schedule(
            'default',
            'recipe_crawler',
            settings=settings,
            url=url,
            domain=domain
            )

        return JsonResponse({
            'task_id': task,
            'unique_id': unique_id,
            'status': 'started'
        })

    # GET requests are for checking on status of specific crawling task
    elif data.get('method') == 'GET':
        # if crawling is complete, then crawled data is returned
        print('GET:', data)
        task_id = data.get('task_id', None)
        unique_id = data.get('unique_id', None)

        # validate
        if not task_id or not unique_id:
            return JsonResponse({'error': 'Missing args'})

        # check status of crawling task every few seconds.
        # if finished query from database and get results
        # else return active status
        # possible results are => pending, running, finished
        status = scrapyd.job_status('default', task_id)
        print(status)
        if status == 'finished':
            try:
                # this is the unique_id that was created above
                item = CrawledRecipeItem.objects.get(unique_id=unique_id)
                # title = RecipeItem.objects.get('title')
                print('------Item------', item)
                return JsonResponse({'data': item.to_dict})
            except Exception as e:
                return JsonResponse({'error': str(e)})
        else:
            return JsonResponse({'status': status})