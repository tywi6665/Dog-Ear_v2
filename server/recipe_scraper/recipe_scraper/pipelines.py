# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from main.models import CrawledRecipeItem
import json
import logging
import re

class RecipeScraperPipeline:
    def __init__(self, unique_id, *args, **kwargs):
        self.unique_id = unique_id
        self.items = []

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            #this will be passed from django view
            unique_id = crawler.settings.get('unique_id')
        )

    def close_spider(self, spider):
        # this is where we are saving the crawled data with django models
        item = CrawledRecipeItem()
        item.unique_id = self.unique_id
        # item.data = json.dumps(self.items)
        item.url = self.items[0]
        item.title = self.items[1]
        item.author = self.items[2]
        item.description = self.items[3]
        item.img_src = self.items[4]
        item.tags = self.items[5]
        item.tags = [tag.strip() for tag in item.tags]
        item.save()

    def process_item(self, item, spider):
        self.items.append(item['url'])
        self.items.append(item['title'])
        self.items.append(item['author'])
        re.sub('/<([^>]+)>/', '', item['description'])
        self.items.append(item['description'])
        self.items.append(item['img_src'])
        self.items.append(item['tags'])
        return item
