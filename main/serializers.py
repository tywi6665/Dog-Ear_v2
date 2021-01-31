from rest_framework import serializers
from .models import RecipeItem, CrawledRecipeItem

class RecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeItem
        fields = (
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

class CrawledRecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrawledRecipeItem
        fields = (
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