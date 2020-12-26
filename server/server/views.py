from django.http import JsonResponse, HttpResponse
# from django.shortcuts import render


def hello(request):
    return JsonResponse({'response_text':'hello world!'})

# def home_view(request, *args, **kwargs):
#     print(args, kwargs)
#     print(request.user)
#     return render(request, "index.html", {})