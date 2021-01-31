from main.views import is_valid_url

async def websocket_application(scope, receive, send):
    while True:
        event = await receive()

        if event['type'] == 'websocket.connect':
            await send({
                'type': 'websocket.accept'
            })

        if event['type'] == 'websocket.disconnect':
            print("Websocket disconnected")
            break

        if event['type'] == 'websocket.receive':
            if event['text'] == 'ping':

                # valid = is_valid_url('https://dev.to/jaydenwindle/adding-websockets-to-your-django-app-with-no-extra-dependencies-2f6h') 
                await send({
                    'type': 'websocket.send',
                    'text': 'pong'
                })