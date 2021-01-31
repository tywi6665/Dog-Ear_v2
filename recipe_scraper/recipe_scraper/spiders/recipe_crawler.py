import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from recipe_scraper.recipe_scraper.items import RecipeScraperItem
import re


class RecipeCrawlerSpider(scrapy.Spider):
    name = 'recipe_crawler'
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

        # custom title case function that handles apostrophes
        def titlecase(s):
            return re.sub(r"[A-Za-z]+('[A-Za-z]+)?",
                            lambda mo:
                            mo.group(0)[0].upper() +
                            mo.group(0)[1:].lower(), s)

        item = RecipeScraperItem()
        item['url'] = response.url

        # Defining defaults
        item['title'] = ''
        item['img_src'] = ''
        item['author'] = ''
        item['description'] = ''
        item['tags'] = []

        if self.domain == 'food52.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@name='sailthru.title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.xpath("//meta[@name='sailthru.author']/@content")[0].extract())
                item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
                item['tags'] = response.xpath("//meta[@name='sailthru.tags']/@content")[0].extract().split(",")
            except:
                print('An error has occurred')
        elif self.domain == 'www.seriouseats.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.css("div.author-byline.brief > div > span > a::text").get())
                item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
                item['tags'] = response.css("header > div.breadcrumbs > ul > li > a > strong::text").getall()
            except:
                print('An error has occurred')
        elif self.domain == 'www.bonappetit.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.xpath("//meta[@name='author']/@content")[0].extract())
                item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
                item['tags'] = response.xpath("//meta[@name='keywords']/@content")[0].extract().split(",")
            except:
                print('An error has occurred')
        elif self.domain == 'cooking.nytimes.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.css("div.nytc---recipebyline---bylinePart > a::text").get())
                item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
                item['tags'] = response.css("div.tags-nutrition-container > a::text").getall()
            except:
                print('An error has occurred')
        elif self.domain == 'www.cooksillustrated.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.css("img.recipe-detail-header__image::attr(src)").get()
                item['author'] = "Cooks Illustrated"
                # if response.css("span.toggle") is not None:
                item['description'] = response.css("div.recipe-detail-header__why > div > div > p::text").get()
                item['tags'] = response.xpath("//meta[@name='atk:keywords']/@content")[0].extract().split(',')
            except:
                print('An error has occurred')
        elif self.domain == 'smittenkitchen.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = "Smitten Kitchen"
                item['description'] = response.xpath("//meta[@property='og:description']/@content")[0].extract()
                item['tags'] = response.css("span.cat-links > a::text").getall()
            except:
                print('An error has occurred')
        elif self.domain == 'www.justonecookbook.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = "Namiko Chen"
                item['description'] = response.xpath("//meta[@property='og:description']/@content")[0].extract()
                item['tags'] = response.css("div.wprm-recipe-keyword-container > span.wprm-recipe-keyword::text").getall()
            except:
                print('An error has occurred')
        elif self.domain == 'www.101cookbooks.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.xpath("//meta[@property='article:author']/@content")[0].extract())
                item['description'] = response.xpath("//meta[@name='description']/@content")[0].extract()
            except:
                print('An error has occurred')
        elif self.domain == 'omnivorescookbook.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = 'Maggie Zhu'
                item['description'] = response.xpath("//meta[@property='og:description']/@content")[0].extract()
            except:
                print('An error has occurred')
        elif self.domain == 'thewoksoflife.com':
            try:
                item['title'] = titlecase(response.xpath("//meta[@property='og:title']/@content")[0].extract())
                item['img_src'] = response.xpath("//meta[@property='og:image']/@content")[0].extract()
                item['author'] = titlecase(response.css("span.entry-author > a.entry-author-link > span.entry-author-name::text").get())
                item['description'] = response.css("//meta[@property='og:description']/@content")[0].extract()
            except:
                print('An error has occurred')

        self.logger.info('--------Item------- %s', item)
        
        return item
