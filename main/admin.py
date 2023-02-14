from django.contrib import admin
from .models import RecipeItem, CrawledRecipeItem, ImageItem

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
        'ingredients',
        'steps'
        )

# Register your models here.
admin.site.register(RecipeItem, RecipeItemAdmin)
admin.site.register(CrawledRecipeItem, RecipeItemAdmin)
admin.site.register(ImageItem)