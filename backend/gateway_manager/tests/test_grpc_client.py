import unittest
from unittest.mock import Mock, patch
from concurrent.futures import Future
import grpc

from gateway_manager.services.grpc_client import GatewayGRPCClient, GatewayGRPCManager
from gateway_manager.protobuf import gateway_agent_pb2 as pb2
from gateway_manager.protobuf import gateway_agent_pb2_grpc as pb2_grpc
from grpc.experimental import Channel


# mock
class MockGatewayAgentStub:
    def Uptime(self, request, timeout):
        return pb2.UptimeResponse(uptime="1d 2h 3m")
    
    def CpuUsage(self, request, timeout):
        return pb2.CpuUsageResponse(cpu_usage="25.5%")
    
    def MemoryUsage(self, request, timeout):
        return pb2.MemoryUsageResponse(memory_usage="40.0%")
    
    def ReadLiveLogs(self, request):
        yield pb2.LiveLogResponse(log="Log line1")
        yield pb2.LiveLogResponse(log="Log line2")
        yield pb2.LiveLogResponse(log="Log line3")


# test client
class TestGatewayGRPCClient(unittest.TestCase):

    def setup(self):
        self.client = GatewayGRPCClient("localhost", 50051)

    @patch('gateway_manager.services.grpc_client.grpc.insecure_channel')
    @patch('gateway_manager.services.grpc_client.gateway_agent_pb2_grpc.GatewayAgentStub')
    def test_get_uptime_success(self, MockStub, MockChannel):
        mock_stub_instance = MockGatewayAgentStub()
        MockStub.return_value = mock_stub_instance

        MockChannel.return_value.__enter__.return_value = Mock()

        uptime = self.client.get_uptime()

        self.assertEqual(uptime, "1d 2h 3m")
        MockStub.assert_called_once_with(MockChannel.return_value.___enter__.return_value)
        MockChannel.assert_called_once()


    @patch('gateway_manager.services.grpc_client.grpc.insecure_channel')
    def test_get_uptime_failure(self, MockChannel):
        MockChannel.return_value.__enter__.side_effect = grpc.RpcError("Connection Failed")
        
        uptime = self.client.get_uptime()
        
        self.assertIsNone(uptime)
        MockChannel.assert_called_once()

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient.create_streaming_connection')
    def test_read_live_logs_stream(self, mock_create_channel):
        with patch.object(pb2_grpc, 'GatewayAgentStub', return_value=MockGatewayAgentStub()):
            mock_channel = Mock()
            mock_create_channel.return_value = mock_channel
            
            logs_generator = self.client.read_live_logs_stream("test-stream-1")
            
            logs = list(logs_generator)
            
            self.assertEqual(len(logs), 3)
            self.assertEqual(logs, ["Log line 1", "Log line 2", "Log line 3"])
            mock_create_channel.assert_called_once_with("test-stream-1") # Call func assertion


