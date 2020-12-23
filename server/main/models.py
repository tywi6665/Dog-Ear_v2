import json
from django.db import models
from django.utils import timezone

# Create your models here.
class RecipeItem(models.Model):
    unique_id = models.CharField(max_length=100, null=True)
    url = models.CharField(max_length=200, blank=False)
    title = models.CharField(max_length=200, blank=False)
    author = models.CharField(max_length=200, blank=True)
    description = models.TextField(max_length=None, blank=True)
    has_made = models.BooleanField(default=False)
    img_src = models.CharField(max_length=200, blank=True)
    notes = models.TextField(max_length=None, blank=True)
    rating = models.IntegerField(default=0)
    tags = models.JSONField(default=[])
    timestamp = models.DateTimeField(default=timezone.now)

