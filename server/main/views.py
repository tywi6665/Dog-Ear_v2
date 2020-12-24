from uuid import uuid4
from urllib.parse import urlparse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST, require_http_methods
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scrapyd_api import ScrapydAPI
from main.utils import URLUtil
from main.models import RecipeItem

# connect to scrapyd service
scrapyd = ScrapydAPI('http://localhost:6800')

# url validation function
def is_valid_url(url):
    validate = URLValidator()
    try:
        validate(url) # check to see if url format is valid
    except ValidationError:
        return False
    return rue

# csrf security token exemption
@csrf_exempt

# specifies accepted http methods
@require_http_methods(['POST', 'GET'])

# crawling function
def crawl(request):
    # POST requests == new crawling task
    if request.method == 'POST':
        # take url from client
        url = request.POST.get('url', None)
        # if url does not exist
        if not url:
            return JsonResponse({'error': 'Missing args'})
        # if url is not valid return error
        if not is_valid_url(url):
            return JsonResponse({'error': 'URL is invalid'})

        # parse the url and extract its domain
        domain = urlparse(url).netloc
        # create a unique id
        unique_id = str(uuid4())
        
        # custom settings for scrapy spider
        settings = {
            'unique_id': unique_id, # unique id for each entry in DB
            'USER_AGENT': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }

        # schedule a new crawling task
        # return a id which will be used to check on the task's status
        task = scrapyd.schedule(
            'default',
            'icrawler',
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
    elif request.method == 'GET':
        # if crawling is complete, then crawled data is returned
        task_id = request.GET.get('task_id', None)
        unique_id = request.GET.get('unique_id', None)

        # validate
        if not task_id or not unique_id:
            return JsonResponse({'error': 'Missing args'})

        # check status of crawling task every few seconds.
        # if finished query from database and get results
        # else return active status
        # possible results are => pending, running, finished
        status = scrapyd.job_status('default', task_id)
        if status == 'finished':
            try:
                # this is the unique_id that was created above
                item = RecipeItem.objects.get(unique_id=unique_id)
                return JsonResponse({'data': item.to_dict['data']})
            except Exception as e:
                return JsonResponse({'error': str(e)})
        else:
            return JsonResponse({'status': status})