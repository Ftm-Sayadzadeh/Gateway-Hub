try:
    from . import gateway_agent_pb2
    from . import gateway_agent_pb2_grpc
    from .gateway_agent_pb2 import (
        LogType,
        LiveLogsRequest,
        LiveLogsResponse,
        UptimeResponse,
        CpuUsageResponse,
        MemoryUsageResponse,
        NullRequest,
        NullResponse
    )

    from .gateway_agent_pb2_grpc import (
        GatewayAgentStub,
        GatewayAgentServicer,
        add_GatewayAgentServicer_to_server,
        GatewayAgent
    )

    __all__ = [
        'gateway_agent_pb2',
        'gateway_agent_pb2_grpc',
        'LogType',
        'LiveLogsRequest',
        'LiveLogsResponse',
        'UptimeResponse',
        'CpuUsageResponse',
        'MemoryUsageResponse',
        'NullRequest',
        'NullResponse',
        'GatewayAgentStub',
        'GatewayAgentServicer',
        'add_GatewayAgentServicer_to_server',
        'GatewayAgent'
    ]

except ImportError as e:
    print(f"Warning: Could not import protobuf files: {e}")
    print("Make sure to generate protobuf files using: python -m grpc_tools.protoc")
    
    # Create dummy classes
    class DummyLogType:
        CONTROLLER = 0
        SETTING = 1
        GATEWAY_AGENT = 2
    
    class DummyRequest:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    LogType = DummyLogType
    LiveLogsRequest = DummyRequest
    NullRequest = DummyRequest
    
    __all__ = ['LogType', 'LiveLogsRequest', 'NullRequest']