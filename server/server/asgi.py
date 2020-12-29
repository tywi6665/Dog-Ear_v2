"""
ASGI config for server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'http':
        # let django handle the HTTP requests
        await django_application(scope, receive, send)
    elif scope['type'] == 'websocket':
        # let Websocket connection handle the request
        pass
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")
