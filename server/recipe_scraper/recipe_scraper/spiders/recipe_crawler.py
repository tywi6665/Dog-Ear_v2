import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class RecipeCrawlerSpider(CrawlSpider):
    name = 'recipe_crawler'

    # Dynamic methods that allows Django to pass values to crawler
    def __init__(self, *args, **kwargs):
        # going to pass these args from django view 
        # To make everything dynamic, we need to override them inside __init__ method
        self.url = kwargs.get('url')
        self.domain = kwargs.get('domain')
        self.start_urls = [self.url]
        self.allowed_domains = [self.domain]

        RecipeCrawlerSpider.rules = [
            Rule(LinkExtractor(unique=True), callback='parse_item')
        ]
        super(RecipeCrawlerSpider, self).__init__(*args, **kwargs)


    def parse_item(self, response):
        recipe = {}
        #item['domain_id'] = response.xpath('//input[@id="sid"]/@value').get()
        #item['name'] = response.xpath('//div[@id="name"]').get()
        #item['description'] = response.xpath('//div[@id="description"]').get()
        recipe['url'] = response.url
        return recipe
