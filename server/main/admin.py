from django.contrib import admin
from .models import RecipeItem

class RecipeItemAdmin(admin.ModelAdmin):
    list_display = (
        'unique_id',
        'url',
        'title',
        'author',
        'description',
        'has_made',
        'img_src',
        'notes',
        'rating',
        'tags',
        'timestamp',
        )

# Register your models here.
admin.site.register(RecipeItem, RecipeItemAdmin)