import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from recipe_scraper.items import RecipeScraperItem


class RecipeCrawlerSpider(scrapy.Spider):
    name = 'food52_crawler'
    # allowed_domains = ['food52.com']
    # start_urls = ['https://food52.com/recipes']
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'

    # rules = (
    #     # Extract links matching '/recipes' and parse them with the spider's method parse_item
    #     Rule(LinkExtractor(unique=True), callback='parse_item'),
    # )
    # Dynamic methods that allows Django to pass values to crawler
    def __init__(self, *args, **kwargs):
        # going to pass these args from django view 
        # To make everything dynamic, we need to override them inside __init__ method
        self.url = kwargs.get('url')
        self.domain = kwargs.get('domain')
        self.start_urls = [self.url]
        self.allowed_domains = [self.domain]
        # self.logger.info('--------Passed In URL------- %s', self.url)
        # RecipeCrawlerSpider.rules = [
        #     Rule(LinkExtractor(unique=True), callback='parse_item')
        # ]
        # super(RecipeCrawlerSpider, self).__init__(*args, **kwargs)


    def parse(self, response):
        self.logger.info('--------Now crawling------- %s', self.url)
        self.logger.info('--------Domain------- %s', self.domain)
        # recipe = scrapy.Item()
        item = RecipeScraperItem()
        item['url'] = response.url

        # if self.domain == 'food52.com':
        try:
            item['title'] = response.xpath("//meta[@name='sailthru.title']/@content")[0].extract()
            item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
            item['author'] = response.xpath("//meta[@name='sailthru.author']/@content")[0].extract()
            item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
            item['tags'] = response.xpath("//meta[@name='sailthru.tags']/@content")[0].extract()
        except:
            print('An error has occurred')
        self.logger.info('--------Item------- %s', item)
        
        return item
