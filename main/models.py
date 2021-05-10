import json
from django.db import models
from django.utils import timezone

# Create your models here.
class RecipeItem(models.Model):
    unique_id = models.CharField(max_length=100, null=True)
    url = models.CharField(max_length=300, blank=False)
    title = models.CharField(max_length=300, blank=False)
    author = models.CharField(max_length=200, blank=True)
    description = models.TextField(max_length=None, blank=True)
    has_made = models.BooleanField(default=False)
    img_src = models.CharField(max_length=900, blank=True)
    notes = models.JSONField(default=list)
    rating = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.unique_id

class CrawledRecipeItem(models.Model):
    unique_id = models.CharField(max_length=100, null=True)
    url = models.CharField(max_length=300, blank=False)
    title = models.CharField(max_length=300, blank=False)
    author = models.CharField(max_length=200, blank=True)
    description = models.TextField(max_length=None, blank=True)
    has_made = models.BooleanField(default=False)
    img_src = models.CharField(max_length=900, blank=True)
    notes = models.JSONField(default=list)
    rating = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    timestamp = models.DateTimeField(default=timezone.now)

    # This is for basic and custom serialization to return it to client as a JSON.
    @property
    def to_dict(self):
        data = {
            'unique_id': self.unique_id,
            'url': self.url,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'has_made': self.has_made,
            'img_src': self.img_src,
            'notes': self.notes,
            'rating': self.rating,
            'tags': self.tags,
            'timestamp': self.timestamp
        }
        return data 

    def __str__(self):
        return self.unique_id