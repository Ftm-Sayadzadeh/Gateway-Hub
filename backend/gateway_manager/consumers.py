import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from graphql import parse, validate
from gateway_project.schema import schema

logger = logging.getLogger(__name__)

class GraphQLWebSocketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subscriptions = {} 
        self.gateway_groups = set()

    async def connect(self):
        await self.accept(subprotocol="graphql-ws")
        logger.info(f"WebSocket connection established: {self.channel_name}")

    async def disconnect(self, close_code):
        for group_name in self.gateway_groups:
            await self.channel_layer.group_discard(group_name, self.channel_name)
        
        logger.info(f"WebSocket disconnected: {self.channel_name}, code: {close_code}")

    async def receive(self, text_data):
        try:
            message = json.loads(text_data) # json steing -> dictionary
            await self.handle_message(message)
        except json.JSONDecodeError:
            await self.send_error("Invalid JSON")
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            await self.send_error(str(e))

    async def handle_message(self, message):
        try:
            message_type = message.get('type')
            logger.info(f"Handling message type: {message_type}")
            
            if message_type == 'connection_init':
                await self.send_message({'type': 'connection_ack'})
                logger.info("Connection acknowledged")
                
            elif message_type == 'start':
                logger.info("Starting subscription...")
                await self.handle_subscription_start(message)
                
            elif message_type == 'stop':
                await self.handle_subscription_stop(message)
                
            elif message_type == 'connection_terminate':
                await self.close()
                
        except Exception as e:
            logger.error(f"Error in handle_message: {e}")
            await self.send_error(str(e))

    async def handle_subscription_start(self, message):
        subscription_id = message.get('id')
        payload = message.get('payload', {})
        query = payload.get('query')
        variables = payload.get('variables', {})
        
        if not query or not subscription_id:
            await self.send_error("Missing query or subscription ID")
            return

        try:
            document = parse(query) # document node
            validation_errors = validate(schema, document)
            
            if validation_errors:
                await self.send_error(f"Validation errors: {validation_errors}")
                return

            # store
            self.subscriptions[subscription_id] = {
                'query': query,
                'variables': variables,
                'document': document
            }

            # execute
            result = await schema.execute_async(
                document,
                variable_values=variables,
                context_value={'consumer': self, 'subscription_id': subscription_id}  # has gotten by resolver -> send response to this client
            )

            if result.errors:
                await self.send_error(f"Execution errors: {result.errors}")
                return

        except Exception as e:
            logger.error(f"Subscription start error: {e}")
            await self.send_error(str(e))

    async def handle_subscription_stop(self, message):
        subscription_id = message.get('id')
        if subscription_id in self.subscriptions:
            del self.subscriptions[subscription_id]

    async def send_message(self, message):
        await self.send(text_data=json.dumps(message)) # dict => JSON

    async def send_error(self, error_message):
        await self.send_message({
            'type': 'error',
            'payload': {'message': error_message}
        })

    async def send_subscription_data(self, event): # event by channel layer or schema -> client (graphql-ws)
        subscription_id = event.get('subscription_id') 
        data = event.get('data')
        
        if subscription_id and data:
            await self.send_message({
                'type': 'data',
                'id': subscription_id,
                'payload': data
            })

    # any message sent to one group, will be sent to all this group members
    async def join_gateway_group(self, gateway_id):
        group_name = f"gateway_{gateway_id}_monitoring"
        await self.channel_layer.group_add(group_name, self.channel_name)
        self.gateway_groups.add(group_name)
        logger.info(f"Joined gateway monitoring group: {group_name}")

    async def leave_gateway_group(self, gateway_id):
        group_name = f"gateway_{gateway_id}_monitoring"
        await self.channel_layer.group_discard(group_name, self.channel_name)
        self.gateway_groups.discard(group_name)
        logger.info(f"Left gateway monitoring group: {group_name}")

    # message handlers
    async def gateway_system_info(self, event):
        await self.send_subscription_data(event)

    async def gateway_live_logs(self, event):
        await self.send_subscription_data(event)

    async def gateway_status_change(self, event):
        await self.send_subscription_data(event)