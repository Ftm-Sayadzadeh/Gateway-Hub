import graphene
import asyncio
import logging
from channels.layers import get_channel_layer
from .models import Gateway
from .services.grpc_client import grpc_manager

logger = logging.getLogger(__name__)

class SystemInfoType(graphene.ObjectType):
    gateway_id = graphene.ID()
    gateway_address = graphene.String()
    gateway_port = graphene.Int()
    connection_string = graphene.String()
    uptime = graphene.String()
    cpu_usage = graphene.String()
    memory_usage = graphene.String()
    status = graphene.String()
    timestamp = graphene.Float()
    error = graphene.String()

class LiveLogType(graphene.ObjectType):
    graphene_id = graphene.ID()
    timestamp = graphene.String()
    log_level = graphene.String()
    service_type = graphene.String()
    message = graphene.String()
    line_number = graphene.Int()

class Subscription(graphene.ObjectType):
    gateway_system_info = graphene.Field(
        SystemInfoType,
        gateway_id = graphene.ID(required=True),
        description="Subscribe to real time system info from specific gateway!"
    )

    gateway_live_logs = graphene.Field(
        LiveLogType,
        gateway_id = graphene.ID(required=True),
        log_type = graphene.Int(default_value=2),
        line_count = graphene.Int(default_value=100),
        description="Subscribe to live logs from specific gateway!"
    )

    async def resolve_gateway_system_info(self, info, gateway_id):
        try:
            gateway = await Gateway.objects.aget(id=gateway_id)
            consumer = info.context.get('consumer') # web socket
            subscription_id = info.context.get('subscription_id')

            if consumer:
                await consumer.join_gateway_group(gateway_id) # join the channel layer group

            # background Task - does not block the current function :))))
            asyncio.create_task(
                self._monitor_gateway_system_info(gateway, consumer, subscription_id)
            )

            client = grpc_manager.get_client(gateway.address, gateway.port)
            system_info = client.get_system_info()
            
            return SystemInfoType(
                gateway_id=gateway.id,
                gateway_address=system_info['gateway_address'],
                gateway_port=system_info['gateway_port'],
                uptime=system_info['uptime'],
                cpu_usage=system_info['cpu_usage'],
                memory_usage=system_info['memory_usage'],
                status=system_info['status'],
                timestamp=system_info['timestamp']
            )
        
        except Gateway.DoesNotExist:
            raise Exception(f"Gateway {gateway_id} not found")
   
    async def resolve_gateway_live_logs(self, info, gateway_id, log_type=2, line_count=100):
        try:
            gateway = await Gateway.objects.aget(id=gateway_id)
            consumer = info.context.get('consumer') # web socket
            subscription_id = info.context.get('subscription_id')

            if consumer:
                await consumer.join_gateway_group(gateway_id) # join the channel layer group

            # background Task - does not block the current function :))))
            asyncio.create_task(
                self._stream_gateway_logs(gateway, consumer, subscription_id, log_type, line_count)
            )
            # task -> consumer -> websocket

            return SystemInfoType(
                gateway_id=gateway.id,
                timestamp="",
                log_level="INFO",
                service_type="SYSTEM",
                message="Live logs streaming started...",
                line_number=0
            )
        
        except Gateway.DoesNotExist:
            raise Exception(f"Gateway {gateway_id} not found")
        
    async def _monitor_gateway_system_info(self, gateway, consumer, subscription_id, interval=5):
        # background task check system info each 5 sec 
        # -> send to client by radis
        channel_layer = get_channel_layer()

        while True:
            try:
                client = grpc_manager.get_client(gateway.address, gateway.port)
                system_info = client.get_system_info()

                if consumer and channel_layer:
                    await channel_layer.group_send(
                        f"gateway_{gateway.id}_monitoring",
                        {
                            'type': 'gateway_system_info',  # consumer method name
                            'subscription_id': subscription_id,
                            'data': {
                                'gatewaySystemInfo': {
                                    'gatewayId': str(gateway.id),
                                    'gatewayAddress': system_info['gateway_address'],
                                    'gatewayPort': system_info['gateway_port'],
                                    'uptime': system_info['uptime'],
                                    'cpuUsage': system_info['cpu_usage'],
                                    'memoryUsage': system_info['memory_usage'],
                                    'status': system_info['status'],
                                    'timestamp': system_info['timestamp']
                                }
                            }
                        }
                    )

            except Exception as e:
                logger.error(f"Error monitoring gateway {gateway.id}: {e}")
                await asyncio.sleep(interval)

    async def _stream_gateway_logs(self, gateway, consumer, subscription_id, log_type, line_count):

        channel_layer = get_channel_layer()
        stream_id = f"logs_{gateway.id}_{subscription_id}"

        try:
            log_generator = grpc_manager.start_live_logs_stream(
                gateway.address,
                gateway.port,
                stream_id,
                log_type,
                "",
                line_count
            )

            line_number = 1
            for log_line in log_generator:
                if consumer and channel_layer:
                    await channel_layer.group_send(
                        f"gateway_{gateway.id}_monitoring",
                        {
                            'type': 'gateway_live_logs',
                            'subscription_id': subscription_id,
                            'data': {
                                'gatewayLiveLogs': {
                                    'gatewayId': str(gateway.id),
                                    'timestamp': "",
                                    'logLevel': "INFO",
                                    'serviceType': "AGENT",
                                    'message': log_line,
                                    'lineNumber': line_number
                                }
                            }
                        }
                    )

                line_number += 1
            
        except Exception as e:
            logger.error(f"Error streaming logs for gateway {gateway.id}: {e}")    

        finally:
            grpc_manager.stop_live_logs_stream(gateway.address, gateway.port, stream_id)
