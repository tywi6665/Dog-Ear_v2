release: cd server && python manage.py migrate
web: cd server/server && gunicorn wsgi --log-file - && cd ../recipe_scraper scrapyd