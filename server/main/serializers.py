from rest_framework import serializers
from .models import RecipeItem

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