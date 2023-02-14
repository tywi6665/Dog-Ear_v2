from rest_framework import serializers
from .models import RecipeItem, CrawledRecipeItem, ImageItem

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
            'ingredients',
            'steps',
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
            'ingredients',
            'steps',
            'timestamp',
        )

class ImageItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageItem
        fields = (
            'unique_id',
            'image',
            'timestamp',
        )