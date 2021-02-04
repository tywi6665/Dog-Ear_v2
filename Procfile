release: python manage.py makemigrations & python manage.py migrate
web: gunicorn server.wsgi --log-file - & scrapyd
