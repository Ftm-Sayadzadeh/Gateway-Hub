import grpc
import logging
import threading
import time
from typing import Optional, Dict, Any, Generator
from contextlib import contextmanager
from concurrent.futures import ThreadPoolExecutor
from django.conf import settings

from ..protobuf import gateway_agent_pb2, gateway_agent_pb2_grpc

logger = logging.getLogger(__name__)

class GatewayGRPCClient:
    def __init__(self, gateway_address: str, gateway_port: int, timeout: int=10):
        self.gateway_address = gateway_address
        self.gateway_port = gateway_port
        self.timeout = timeout
        self.connection_string = f"{gateway_address}:{gateway_port}"
        self._streaming_connections = {}
        self._connection_lock = threading.Lock()

    @contextmanager
    def get_channel(self):
        channel = None
        try:
            channel = grpc.insecure_channel(
                self.connection_string,
                options=[
                    ('grpc.keepalive_time_ms', 30000),
                    ('grpc.keepalive_timeout_ms', 5000),
                    ('grpc.keepalive_permit_without_calls', True),
                    ('grpc.http2.max_pings_without_data', 0),
                    ('grpc.http2.min_time_between_pings_ms', 10000),
                    ('grpc.http2.min_ping_interval_without_data_ms', 300000)
                ]
            )
            
            grpc.channel_ready_future(channel).result(timeout=self.timeout)
            logger.debug(f"Connected to gateway at {self.connection_string}")
            
            yield channel
            
        except grpc.RpcError as e:
            logger.error(f"gRPC Error connecting to {self.connection_string}: {e}")
            raise
        except Exception as e:
            logger.error(f"Connection error to {self.connection_string}: {e}")
            raise
        finally:
            if channel:
                channel.close()

    def get_uptime(self) -> Optional[str]:
        try:
            with self.get_channel() as channel:
                stub = gateway_agent_pb2_grpc.GatewayAgentStub(channel)
                request = gateway_agent_pb2.NullRequest()
                response = stub.Uptime(request, timeout=self.timeout)
                logger.debug(f"Uptime received from {self.connection_string}: {response.uptime}")
                return response.uptime
        except Exception as e:
            logger.error(f"Error getting uptime from {self.connection_string}: {e}")
            return None
    
    def get_cpu_usage(self) -> Optional[str]:
        try:
            with self.get_channel() as channel:
                stub = gateway_agent_pb2_grpc.GatewayAgentStub(channel)
                request = gateway_agent_pb2.NullRequest()
                response = stub.CpuUsage(request, timeout=self.timeout)
                logger.debug(f"CPU usage received from {self.connection_string}: {response.cpu_usage}")
                return response.cpu_usage
        except Exception as e:
            logger.error(f"Error getting CPU usage from {self.connection_string}: {e}")
            return None 

    def get_memory_usage(self) -> Optional[str]:
        try:
            with self.get_channel() as channel:
                stub = gateway_agent_pb2_grpc.GatewayAgentStub(channel)
                request = gateway_agent_pb2.NullRequest()
                response = stub.MemoryUsage(request, timeout=self.timeout)
                logger.debug(f"Memory usage received from {self.connection_string}: {response.memory_usage}")
                return response.memory_usage
        except Exception as e:
            logger.error(f"Error getting memory usage from {self.connection_string}: {e}")
            return None
        
    def get_system_info(self) -> Dict[str, Any]:
        info = {
            'gateway_address': self.gateway_address,
            'gateway_port': self.gateway_port,
            'connection_string': self.connection_string,
            'uptime': None,
            'cpu_usage': None,
            'memory_usage': None,
            'status': 'offline',
            'timestamp': time.time(),
            'error': None
        }
        
        try:
            info['uptime'] = self.get_uptime()
            info['cpu_usage'] = self.get_cpu_usage()
            info['memory_usage'] = self.get_memory_usage()
            
            if any([info['uptime'], info['cpu_usage'], info['memory_usage']]):
                info['status'] = 'online'
                
        except Exception as e:
            logger.error(f"Error getting system info from {self.connection_string}: {e}")
            info['error'] = str(e)
        
        return info

    # streaming
    def create_streaming_connection(self, stream_id: str) -> Optional[grpc.Channel]:
        try:
            with self._connection_lock:
                if stream_id in self._streaming_connections:
                    return self._streaming_connections[stream_id]
                
                channel = grpc.insecure_channel(
                    self.connection_string,
                    options=[
                        ('grpc.keepalive_time_ms', 30000),
                        ('grpc.keepalive_timeout_ms', 5000),
                        ('grpc.keepalive_permit_without_calls', True),
                        ('grpc.http2.max_pings_without_data', 0),
                        ('grpc.http2.min_time_between_pings_ms', 10000),
                        ('grpc.http2.min_ping_interval_without_data_ms', 300000),
                        ('grpc.max_receive_message_length', 1024 * 1024 * 4),  # 4MB
                    ]
                )
                grpc.channel_ready_future(channel).result(timeout=self.timeout)
                
                self._streaming_connections[stream_id] = channel
                logger.info(f"Created streaming connection {stream_id} to {self.connection_string}")
                return channel
                
        except Exception as e:
            logger.error(f"Error creating streaming connection to {self.connection_string}: {e}")
            return None
    
    def close_streaming_connection(self, stream_id: str):
        with self._connection_lock:
            if stream_id in self._streaming_connections:
                channel = self._streaming_connections.pop(stream_id)
                channel.close()
                logger.info(f"Closed streaming connection {stream_id} to {self.connection_string}")
    
    def read_live_logs_stream(
        self, 
        stream_id: str,
        log_type: int = LogType.GATEWAY_AGENT, 
        traffic_log_index: str = "", 
        line_count: int = 100
    ) -> Generator[str, None, None]:
        channel = None
        try:
            channel = self.create_streaming_connection(stream_id)
            if not channel:
                yield "Error: Could not establish streaming connection"
                return
            
            stub = gateway_agent_pb2_grpc.GatewayAgentStub(channel)
            request = gateway_agent_pb2.LiveLogsRequest(
                type=log_type,
                traffic_log_index=traffic_log_index,
                line_count=line_count
            )
            
            logger.info(f"Starting live logs stream {stream_id} for {self.connection_string}")
            
            for response in stub.ReadLiveLogs(request):
                yield response.log
                
        except grpc.RpcError as e:
            error_msg = f"gRPC streaming error for {self.connection_string}: {e}"
            logger.error(error_msg)
            yield f"Error: {error_msg}"
        except Exception as e:
            error_msg = f"Streaming error for {self.connection_string}: {e}"
            logger.error(error_msg)
            yield f"Error: {error_msg}"
        finally:
            if stream_id:
                self.close_streaming_connection(stream_id)

    def test_connection(self) -> bool:
        try:
            uptime = self.get_uptime()
            return uptime is not None
        except Exception:
            return False
    
    def close_all_streaming_connections(self):
        with self._connection_lock:
            for stream_id in list(self._streaming_connections.keys()):
                self.close_streaming_connection(stream_id)


class GatewayGRPCManager:
    def __init__(self):
        self.clients: Dict[str, GatewayGRPCClient] = {}
        self._manager_lock = threading.Lock()

        self.executor = ThreadPoolExecutor(max_workers=10, thread_name_prefix="grpc_manager")
    
    def get_client(self, gateway_address: str, gateway_port: int) -> GatewayGRPCClient:
        connection_string = f"{gateway_address}:{gateway_port}"
        
        with self._manager_lock:
            if connection_string not in self.clients:
                self.clients[connection_string] = GatewayGRPCClient(
                    gateway_address=gateway_address,
                    gateway_port=gateway_port
                )
                logger.info(f"Created new gRPC client for {connection_string}")
            
            return self.clients[connection_string]
    

    def get_all_gateways_info(self, gateways) -> Dict[str, Dict[str, Any]]:
            results = {}
            
            def get_gateway_info(gateway):
                client = self.get_client(gateway.address, gateway.port)
                return str(gateway.id), client.get_system_info()
            
            futures = []
            for gateway in gateways:
                future = self.executor.submit(get_gateway_info, gateway)
                futures.append(future)
            
            for future in futures:
                try:
                    gateway_id, info = future.result(timeout=30)  # 30 second timeout
                    results[gateway_id] = info
                except Exception as e:
                    logger.error(f"Error getting gateway info: {e}")
            
            return results
    
    def test_gateway_connection(self, gateway_address: str, gateway_port: int) -> bool:
        try:
            client = self.get_client(gateway_address, gateway_port)
            return client.test_connection()
        except Exception as e:
            logger.error(f"Error testing connection to {gateway_address}:{gateway_port}: {e}")
            return False
        

    def start_live_logs_stream(
        self, 
        gateway_address: str, 
        gateway_port: int,
        stream_id: str,
        log_type: int = LogType.GATEWAY_AGENT,
        traffic_log_index: str = "",
        line_count: int = 100
    ) -> Generator[str, None, None]:
        client = self.get_client(gateway_address, gateway_port)
        return client.read_live_logs_stream(
            stream_id=stream_id,
            log_type=log_type,
            traffic_log_index=traffic_log_index,
            line_count=line_count
        )
    
    def stop_live_logs_stream(self, gateway_address: str, gateway_port: int, stream_id: str):
        connection_string = f"{gateway_address}:{gateway_port}"
        if connection_string in self.clients:
            client = self.clients[connection_string]
            client.close_streaming_connection(stream_id)
    
    def cleanup(self):
        with self._manager_lock:
            for client in self.clients.values():
                client.close_all_streaming_connections()
            self.clients.clear()
        
        self.executor.shutdown(wait=True) # shutdown threading pool, wait until all thread complited :)
        logger.info("Cleaned up all gRPC connections")


# Singleton
grpc_manager = GatewayGRPCManager()

import atexit
atexit.register(grpc_manager.cleanup)