# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class RecipeScraperItem(scrapy.Item):
    # define the fields for your item here like:
    url = scrapy.Field()
    title = scrapy.Field()
    author = scrapy.Field()
    description = scrapy.Field()
    img_src = scrapy.Field()
    tags = scrapy.Field()
    pass
