import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gateway_project.settings')

django_asgi_app = get_asgi_application()

def get_websocket_application():
    from gateway_manager.consumers import GraphQLWebSocketConsumer
    return URLRouter([
        path("graphql/subscriptions/", GraphQLWebSocketConsumer.as_asgi()),
    ])

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            get_websocket_application()
        )
    ),
})