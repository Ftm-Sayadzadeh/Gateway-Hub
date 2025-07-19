import graphene
from graphene_django import DjangoObjectType
from django.core.exceptions import ValidationError
from django.db import models
from .models import Gateway


# gateway type
class GatewayType(DjangoObjectType):
    connection_string = graphene.String(description="Full connection string (address:port)")
    is_local = graphene.Boolean(description="Is private/local address?")

    class Meta:
        model = Gateway
        fields = "__all__"

    def resolve_connection_string(self, info):
        return self.connection_string

    def resolve_is_local(self, info):
        return self.is_local


# input type for mutation - all required field
class GatewayInput(graphene.InputObjectType):
    id = graphene.String(required=True, description="Unique identifier for the Gateway")
    name = graphene.String(required=True, description="Display name for the Gateway")
    address = graphene.String(required=True, description="IP address of the Gateway")
    port = graphene.Int(required=True, description="Port number of the Gateway")
    desc = graphene.String(description="Optional description for the Gateway")


# input type for update - optional field
class GatewayUpdateInput(graphene.InputObjectType):
    name = graphene.String(description="New display name for the Gateway")
    address = graphene.String(description="New IP address of the Gateway")
    port = graphene.Int(description="New port number of the Gateway")
    desc = graphene.String(description="New description for the Gateway")
    is_active = graphene.Boolean(description="New active/inactive status of the Gateway")

class Query(graphene.ObjectType):
    all_gateways = graphene.List(
        GatewayType,
        is_active=graphene.Boolean(description="Is active?"),
        description="get a list of all gateways with active status filter",
    )

    gateway = graphene.Field(
        GatewayType,
        id=graphene.String(required=True, description="Unique identifier for the Gateway"),
        description="get a single gateway"
    )

    search_gateways = graphene.List(
        GatewayType,
        query=graphene.String(required=True, description="Search term for name, description, or ID"),
        description="Search Gateways by matching text in their name, description, or ID."
    )

    filter_gateways = graphene.List(
        GatewayType,
        address_contains=graphene.String(description="filter by partial ip address match"),
        port_min=graphene.Int(description="filter by minimum port number"),
        port_max=graphene.Int(description="filter by maximum port number"),
        is_active=graphene.Boolean(description="Is active?"),
        description="filter gateways by active status, port range, address"
    )


    def resolve_all_gateways(self, info, is_active=None):
        queryset = Gateway.objects.all()
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        return queryset

    def resolve_gateway(self, info, id):
        try:
            return Gateway.objects.get(id=id)
        except Gateway.DoesNotExist:
            return None

    def resolve_search_gateways(self, info, query):
        return Gateway.objects.filter(
            models.Q(name__icontains=query) |
            models.Q(desc__icontains=query) |
            models.Q(id__icontains=query)
        )

    def resolve_filter_gateways(self, info, **filters):
        queryset = Gateway.objects.all()

        if filters.get("is_active") is not None:
            queryset = queryset.filter(is_active=filters["is_active"])
        if filters.get("address_contains"):
            queryset = queryset.filter(address__icontains=filters["address_contains"])
        if filters.get("port_min"):
            queryset = queryset.filter(port__gte=filters["port_min"])
        if filters.get("port_max"):
            queryset = queryset.filter(port__lte=filters["port_max"])

        return queryset