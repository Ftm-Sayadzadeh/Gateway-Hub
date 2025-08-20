import unittest
from unittest.mock import Mock, patch, MagicMock
from concurrent.futures import Future
import grpc

from gateway_manager.services.grpc_client import GatewayGRPCClient, GatewayGRPCManager
from gateway_manager.protobuf import gateway_agent_pb2 as pb2
from gateway_manager.protobuf import gateway_agent_pb2_grpc as pb2_grpc


# Mock GatewayAgentStub
class MockGatewayAgentStub:
    def Uptime(self, request, timeout=None):
        return pb2.UptimeResponse(uptime="1d 2h 3m")
    
    def CpuUsage(self, request, timeout=None):
        return pb2.CpuUsageResponse(cpu_usage="25.5%")
    
    def MemoryUsage(self, request, timeout=None):
        return pb2.MemoryUsageResponse(memory_usage="40.0%")
    
    def ReadLiveLogs(self, request):
        yield pb2.LiveLogsResponse(log="Log line 1")
        yield pb2.LiveLogsResponse(log="Log line 2")
        yield pb2.LiveLogsResponse(log="Log line 3")


class TestGatewayGRPCClient(unittest.TestCase):

    def setUp(self):
        self.client = GatewayGRPCClient("localhost", 50051)

    @patch('gateway_manager.services.grpc_client.grpc.channel_ready_future')
    @patch('gateway_manager.services.grpc_client.grpc.insecure_channel')
    @patch('gateway_manager.services.grpc_client.gateway_agent_pb2_grpc.GatewayAgentStub')
    def test_get_uptime_success(self, MockStub, MockChannel, MockChannelReady):
        mock_stub_instance = MockGatewayAgentStub()
        MockStub.return_value = mock_stub_instance
        
        mock_channel = MagicMock()
        MockChannel.return_value = mock_channel
        
        mock_future = Mock()
        mock_future.result.return_value = None    # expecte: channel ready -> None
        MockChannelReady.return_value = mock_future

        uptime = self.client.get_uptime()

        self.assertEqual(uptime, "1d 2h 3m")
        MockStub.assert_called_once_with(mock_channel) # create stub and channel connected successfully?
        MockChannel.assert_called_once()

    @patch('gateway_manager.services.grpc_client.grpc.channel_ready_future')
    @patch('gateway_manager.services.grpc_client.grpc.insecure_channel')
    def test_get_uptime_failure(self, MockChannel, MockChannelReady):
        mock_future = Mock()
        mock_future.result.side_effect = grpc.RpcError("Connection Failed")  # ready to raise exception
        MockChannelReady.return_value = mock_future
        
        uptime = self.client.get_uptime()
        
        self.assertIsNone(uptime)
        MockChannel.assert_called_once()

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient.create_streaming_connection')
    @patch('gateway_manager.services.grpc_client.gateway_agent_pb2_grpc.GatewayAgentStub')
    def test_read_live_logs_stream(self, MockStub, mock_create_channel):
        mock_stub_instance = MockGatewayAgentStub()
        MockStub.return_value = mock_stub_instance
        
        mock_channel = Mock()
        mock_create_channel.return_value = mock_channel
        
        logs_generator = self.client.read_live_logs_stream("test-stream-1")
        logs = list(logs_generator)
        
        self.assertEqual(len(logs), 3)
        self.assertEqual(logs, ["Log line 1", "Log line 2", "Log line 3"])
        mock_create_channel.assert_called_once_with("test-stream-1")

    @patch('gateway_manager.services.grpc_client.grpc.channel_ready_future')
    @patch('gateway_manager.services.grpc_client.grpc.insecure_channel')
    @patch('gateway_manager.services.grpc_client.gateway_agent_pb2_grpc.GatewayAgentStub')
    def test_get_system_info_success(self, MockStub, MockChannel, MockChannelReady):
        mock_stub_instance = MockGatewayAgentStub()
        MockStub.return_value = mock_stub_instance
        
        mock_channel = MagicMock()
        MockChannel.return_value = mock_channel
        
        mock_future = Mock()
        mock_future.result.return_value = None
        MockChannelReady.return_value = mock_future

        system_info = self.client.get_system_info()

        self.assertEqual(system_info['status'], 'online')
        self.assertEqual(system_info['uptime'], '1d 2h 3m')
        self.assertEqual(system_info['cpu_usage'], '25.5%')
        self.assertEqual(system_info['memory_usage'], '40.0%')
        self.assertEqual(system_info['gateway_address'], 'localhost')
        self.assertEqual(system_info['gateway_port'], 50051)


class TestGatewayGRPCManager(unittest.TestCase):
    def setUp(self):
        self.manager = GatewayGRPCManager()
        self.manager.clients = {}  # clean state

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient')
    def test_get_client_creates_new(self, MockClient):
        mock_client_instance = Mock()
        MockClient.return_value = mock_client_instance
        
        client = self.manager.get_client("1.2.3.4", 50051)

        MockClient.assert_called_once_with(gateway_address="1.2.3.4", gateway_port=50051)
        self.assertEqual(self.manager.clients.get("1.2.3.4:50051"), mock_client_instance) # dic?
        self.assertEqual(client, mock_client_instance)

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient')
    def test_get_client_returns_existing(self, MockClient):
        existing_client = Mock()
        self.manager.clients["1.2.3.4:50051"] = existing_client

        client = self.manager.get_client("1.2.3.4", 50051)

        MockClient.assert_not_called() # client existed :)
        self.assertEqual(client, existing_client)

    def test_get_all_gateways_info_parallel(self):
        mock_gateway_1 = Mock(id=1, address="1.1.1.1", port=50051)
        mock_gateway_2 = Mock(id=2, address="2.2.2.2", port=50051)
        gateways = [mock_gateway_1, mock_gateway_2]

        with patch.object(self.manager, 'get_client') as mock_get_client: # real client couldnt be created
            mock_client_1 = Mock()
            mock_client_1.get_system_info.return_value = {"status": "online", "uptime": "1d"}
            
            mock_client_2 = Mock()
            mock_client_2.get_system_info.return_value = {"status": "online", "uptime": "2d"}
            
            def side_effect(address, port):
                if address == "1.1.1.1":
                    return mock_client_1
                elif address == "2.2.2.2":
                    return mock_client_2
            
            mock_get_client.side_effect = side_effect
            
            results = self.manager.get_all_gateways_info(gateways)
            
            self.assertEqual(len(results), 2)
            self.assertIn("1", results)
            self.assertIn("2", results)
            self.assertEqual(results["1"]["uptime"], "1d")
            self.assertEqual(results["2"]["uptime"], "2d")

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient')
    def test_test_gateway_connection_success(self, MockClient):
        mock_client_instance = Mock()
        mock_client_instance.test_connection.return_value = True # connected successfully
        MockClient.return_value = mock_client_instance
        
        result = self.manager.test_gateway_connection("1.1.1.1", 50051)
        
        self.assertTrue(result)
        mock_client_instance.test_connection.assert_called_once()

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient')
    def test_test_gateway_connection_failure(self, MockClient):
        mock_client_instance = Mock()
        mock_client_instance.test_connection.return_value = False
        MockClient.return_value = mock_client_instance
        
        result = self.manager.test_gateway_connection("1.1.1.1", 50051)
        
        self.assertFalse(result)
        mock_client_instance.test_connection.assert_called_once()

    @patch('gateway_manager.services.grpc_client.GatewayGRPCClient')
    def test_start_live_logs_stream(self, MockClient):
        mock_client_instance = Mock()
        mock_generator = iter(["log1", "log2", "log3"])
        mock_client_instance.read_live_logs_stream.return_value = mock_generator
        MockClient.return_value = mock_client_instance
        
        self.manager.clients["1.1.1.1:50051"] = mock_client_instance   # add client to manager's clients dict
        
        result_generator = self.manager.start_live_logs_stream("1.1.1.1", 50051, "stream-1")
        logs = list(result_generator)
        
        self.assertEqual(logs, ["log1", "log2", "log3"])
        mock_client_instance.read_live_logs_stream.assert_called_once()

    def test_cleanup(self):
        mock_client_1 = Mock()
        mock_client_2 = Mock()
        self.manager.clients = {
            "1.1.1.1:50051": mock_client_1,
            "2.2.2.2:50051": mock_client_2
        }
        
        self.manager.cleanup()
        # verify all clients had their connections closed
        mock_client_1.close_all_streaming_connections.assert_called_once()
        mock_client_2.close_all_streaming_connections.assert_called_once()
        
        # Verify clients dict is cleared
        self.assertEqual(len(self.manager.clients), 0)


if __name__ == '__main__':
    unittest.main()