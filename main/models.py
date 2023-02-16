from django.db import models
from django.utils import timezone
from PIL import Image
from io import BytesIO
from django.core.files import File

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
    ingredients = models.TextField(max_length=None, blank=True, default="")
    steps = models.TextField(max_length=None, blank=True, default="")
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
    ingredients = models.TextField(max_length=None, blank=True)
    steps = models.TextField(max_length=None, blank=True)
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
            'ingredients': self.ingredients,
            'steps': self.steps,
            'timestamp': self.timestamp
        }
        return data 

    def __str__(self):
        return self.unique_id

class ImageItem(models.Model):

    unique_id = models.CharField(max_length=100, null=True)
    image = models.ImageField(upload_to='images', blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        new_image =  self.reduce_image_size(self.image)
        self.image = new_image
        super().save(*args, **kwargs)

    def reduce_image_size(self, image):
        img = Image.open(image)
        thumb_io = BytesIO()
        img.save(thumb_io, 'jpeg', quality=40)
        new_image = File(thumb_io, name=self.unique_id)
        return new_image
          
    def delete(self, *args, **kwargs):
        # You have to prepare what you need before delete the model
        storage, path = self.image.storage, self.image.path
        # Delete the model before the file
        super(ImageItem, self).delete(*args, **kwargs)
        # Delete the file after the model
        storage.delete(path)

    def __str__(self):
        return self.unique_id