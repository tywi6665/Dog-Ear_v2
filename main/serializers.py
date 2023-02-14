from rest_framework import serializers
from .models import RecipeItem, CrawledRecipeItem, ImageItem

class RecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeItem
        fields = '__all__'

class CrawledRecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrawledRecipeItem
        fields = '__all__'

class ImageItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageItem
        fields = '__all__'