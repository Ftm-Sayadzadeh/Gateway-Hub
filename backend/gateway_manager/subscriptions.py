import graphene
import asyncio
import logging
import threading
from channels.layers import get_channel_layer
from .models import Gateway
from .services.grpc_client import grpc_manager
from .utils.parsers import parse_cpu_usage, parse_memory_usage, parse_uptime

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
    gateway_id = graphene.ID()
    timestamp = graphene.String()
    log_level = graphene.String()
    service_type = graphene.String()
    message = graphene.String()
    line_number = graphene.Int()

class Subscription(graphene.ObjectType):
    gateway_system_info = graphene.Field(
        SystemInfoType,
        gateway_id=graphene.ID(required=True),
        description="Subscribe to real time system info from specific gateway!"
    )

    gateway_live_logs = graphene.Field(
        LiveLogType,
        gateway_id=graphene.ID(required=True),
        log_type=graphene.Int(default_value=2),
        line_count=graphene.Int(default_value=100),
        description="Subscribe to live logs from specific gateway!"
    )

    def resolve_gateway_system_info(self, info, gateway_id):
        logger.info(f"resolve_gateway_system_info called with gateway_id: {gateway_id}")
        
        try:
            try:
                gateway = Gateway.objects.get(id=gateway_id)
                logger.info(f"Found gateway: {gateway.name} at {gateway.address}:{gateway.port}")
            except Gateway.DoesNotExist:
                logger.error(f"Gateway {gateway_id} not found")
                raise Exception(f"Gateway {gateway_id} not found")
            
            context = info.context
            
            if hasattr(context, 'get'):
                # WebSocket context (dictionary)
                consumer = context.get('consumer')
                subscription_id = context.get('subscription_id')
                logger.info(f"WebSocket context - Consumer: {consumer}, Subscription ID: {subscription_id}")
            elif hasattr(context, 'META'):
                # HTTP context (ASGIRequest)
                consumer = None
                subscription_id = None
                logger.info("Subscription called via HTTP - WebSocket features disabled")
            else:
                # Unknown context
                consumer = None
                subscription_id = None
                logger.warning(f"Unknown context type: {type(context)}")

            if consumer:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                try:
                    loop.run_until_complete(consumer.join_gateway_group(gateway_id))
                    logger.info(f"Successfully joined gateway group for gateway {gateway_id}")
                finally:
                    loop.close()
            else:
                logger.info("No WebSocket consumer - skipping group join")

            logger.info(f"Getting initial system info for gateway {gateway.address}:{gateway.port}")
            client = grpc_manager.get_client(gateway.address, gateway.port)
            system_info = client.get_system_info()
            
            logger.info(f"Raw system info received: {system_info}")
            
            cpu_percent = parse_cpu_usage(system_info.get('cpu_usage'))
            memory_percent = parse_memory_usage(system_info.get('memory_usage'))
            uptime_formatted = parse_uptime(system_info.get('uptime'))
            
            logger.info(f"Parsed data - CPU: {cpu_percent}%, Memory: {memory_percent}%, Uptime: {uptime_formatted}")
            
            if consumer and subscription_id:
                self._start_background_monitoring(gateway, consumer, subscription_id)
            else:
                logger.info("No WebSocket consumer - skipping background monitoring")
            
            result = SystemInfoType(
                gateway_id=gateway.id,
                gateway_address=system_info['gateway_address'],
                gateway_port=system_info['gateway_port'],
                uptime=uptime_formatted,
                cpu_usage=f"{cpu_percent}%" if cpu_percent is not None else None,
                memory_usage=f"{memory_percent}%" if memory_percent is not None else None,
                status=system_info['status'],
                timestamp=system_info['timestamp'],
                error=system_info.get('error')
            )
            
            logger.info(f"Returning initial result: {result}")
            return result
        
        except Exception as e:
            logger.error(f"Error in resolve_gateway_system_info: {e}", exc_info=True)
            return SystemInfoType(
                gateway_id=gateway_id,
                gateway_address="",
                gateway_port=0,
                uptime=None,
                cpu_usage=None,
                memory_usage=None,
                status="error",
                timestamp=0,
                error=str(e)
            )
   
    def resolve_gateway_live_logs(self, info, gateway_id, log_type=2, line_count=100):
        logger.info(f"resolve_gateway_live_logs called with gateway_id: {gateway_id}")
        print("1")
        try:
            try:
                gateway = Gateway.objects.get(id=gateway_id)
                logger.info(f"Found gateway for logs: {gateway.name}")
            except Gateway.DoesNotExist:
                logger.error(f"Gateway {gateway_id} not found")
                raise Exception(f"Gateway {gateway_id} not found")

            context = info.context
            if hasattr(context, 'get'):
                consumer = context.get('consumer')
                subscription_id = context.get('subscription_id')
            elif hasattr(context, 'META'):
                consumer = None
                subscription_id = None
                logger.info("Live logs called via HTTP - WebSocket features disabled")
            else:
                consumer = None
                subscription_id = None

            if consumer:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                try:
                    loop.run_until_complete(consumer.join_gateway_group(gateway_id))
                finally:
                    loop.close()

            if consumer and subscription_id:
                self._start_log_streaming(gateway, consumer, subscription_id, log_type, line_count)

            return LiveLogType(
                gateway_id=gateway.id,
                timestamp="",
                log_level="INFO",
                service_type="SYSTEM",
                message="Live logs streaming started...",
                line_number=0
            )
        
        except Exception as e:
            logger.error(f"Error in resolve_gateway_live_logs: {e}", exc_info=True)
            return LiveLogType(
                gateway_id=gateway_id,
                timestamp="",
                log_level="ERROR",
                service_type="SYSTEM",
                message=f"Error: {str(e)}",
                line_number=0
            )
    
    def _start_background_monitoring(self, gateway, consumer, subscription_id):
        def monitor():
            logger.info(f"Background monitoring thread started for gateway {gateway.id}")
            
            channel_layer = get_channel_layer()
            if not channel_layer:
                logger.error("Channel layer not found")
                return
            
            import time
            while True:
                try:
                    time.sleep(5) 
                    
                    client = grpc_manager.get_client(gateway.address, gateway.port)
                    system_info = client.get_system_info()

                    cpu_percent = parse_cpu_usage(system_info.get('cpu_usage'))
                    memory_percent = parse_memory_usage(system_info.get('memory_usage'))
                    uptime_formatted = parse_uptime(system_info.get('uptime'))

                    async def send_update():
                        await channel_layer.group_send(
                            f"gateway_{gateway.id}_monitoring",
                            {
                                'type': 'gateway_system_info',
                                'subscription_id': subscription_id,
                                'data': {
                                    'gatewaySystemInfo': {
                                        'gatewayId': str(gateway.id),
                                        'gatewayAddress': system_info['gateway_address'],
                                        'gatewayPort': system_info['gateway_port'],
                                        'uptime': uptime_formatted,
                                        'cpuUsage': f"{cpu_percent}%" if cpu_percent is not None else None,
                                        'memoryUsage': f"{memory_percent}%" if memory_percent is not None else None,
                                        'status': system_info['status'],
                                        'timestamp': system_info['timestamp'],
                                        'error': system_info.get('error')
                                    }
                                }
                            }
                        )
                    
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    try:
                        loop.run_until_complete(send_update())
                        logger.debug(f"Sent system info update for gateway {gateway.id}")
                    finally:
                        loop.close()
                        
                except Exception as e:
                    logger.error(f"Error in monitoring thread for gateway {gateway.id}: {e}")
                    time.sleep(5) 

        monitor_thread = threading.Thread(
            target=monitor,
            daemon=True,
            name=f"monitor_gateway_{gateway.id}_{subscription_id}"
        )
        monitor_thread.start()
        logger.info(f"Started monitoring thread for gateway {gateway.id}")
    

    def _start_log_streaming(self, gateway, consumer, subscription_id, log_type, line_count):
        def stream_logs():
            logger.info(f"Log streaming thread started for gateway {gateway.id}")
            channel_layer = get_channel_layer()
            if not channel_layer:
                logger.error("Channel layer not found")
                return
            
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
                    try:
                        async def send_log():
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
                        
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                        try:
                            loop.run_until_complete(send_log())
                        finally:
                            loop.close()
                            
                        line_number += 1
                        
                    except Exception as e:
                        logger.error(f"Error sending log line: {e}")
                        break
            
            except Exception as e:
                logger.error(f"Error in log streaming thread for gateway {gateway.id}: {e}")
            
            finally:
                grpc_manager.stop_live_logs_stream(gateway.address, gateway.port, stream_id)
        
        stream_thread = threading.Thread(
            target=stream_logs,
            daemon=True,
            name=f"logs_gateway_{gateway.id}_{subscription_id}"
        )
        stream_thread.start()
        logger.info(f"Started log streaming thread for gateway {gateway.id}")