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

# Mutation Classes
class CreateGateway(graphene.Mutation):
    class Arguments:
        input = GatewayInput(required=True)

    gateway = graphene.Field(GatewayType)
    success = graphene.Boolean()
    massword = graphene.String()

    def mutate(self, info, input):
        try:
            if Gateway.objects.filter(id=input.id).exists():
                return CreateGateway(
                    success=False,
                    massage="Gateway already exists with this ID",
                    gateway=None
                )
            gateway = Gateway(
                id=input.id,
                name=input.name,
                address=input.address,
                port=input.port,
                desc=input.get('desc', '')
            )
            gateway.full_clean()
            gateway.save()
            return CreateGateway(
                gateway=gateway,
                massage="Gateway created",
                success=True
            )
        except ValidationError as e:
            return CreateGateway(
                geteway=None,
                massage=str(e),
                success=False
            )
        except Exception as e:
            return CreateGateway(
                success=False,
                massage=str(e),
                gateway=None
            )

class UpdateGateway(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = GatewayInput(required=True)

    gateway = graphene.Field(GatewayType)
    success = graphene.Boolean()
    massage = graphene.String()

    def mutate(self, info, id, input):
        try:
            gateway = Gateway.objects.get(id=id)
            for field, value in input.items():
                setattr(gateway, field, value)
            gateway.full_clean()
            gateway.save()
            return UpdateGateway(
                gateway=gateway,
                success=True,
                massage="Gateway updated",
            )
        except Gateway.DoesNotExist:
            return UpdateGateway(
                gateway=None,
                success=False,
                massage=f"Gateway with id {id} does not exist",
            )
        except ValidationError as e:
            return UpdateGateway(
                gateway=None,
                massage=str(e),
                success=False,
            )
        except Exception as e:
            return UpdateGateway(
                gateway=None,
                success=False,
                massage=str(e)
            )

class DeleteGateway(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    success = graphene.Boolean()
    massage = graphene.String()

    def mutate(self, info, id):
        try:
            gateway = Gateway.objects.get(id=id)
            gateway_name = gateway.name
            gateway.delete()
            return DeleteGateway(
                success=True,
                massage=f"Gateway '{gateway_name}' deleted"
            )
        except Gateway.DoesNotExist:
            return DeleteGateway(
                success=False,
                massage=f"Gateway with id {id} does not exist",
            )
        except ValidationError as e:
            return DeleteGateway(
                gateway=None,
                massage=str(e),
            )
        except Exception as e:
            return DeleteGateway(
                succcess=False,
                massage=str(e)
            )

class ToggleGatewayStatus(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    gateway = graphene.Field(GatewayType)
    success = graphene.Boolean()
    massage = graphene.String()

    def mutate(self, info, id):
        try:
            gateway = Gateway.objects.get(id=id)
            gateway.is_active = not gateway.is_active
            gateway.save()
            status = "active" if gateway.is_active else "inactive"
            return ToggleGatewayStatus(
                gateway=gateway,
                success=True,
                massage=f"Gateway '{gateway.name}' {status}"
            )
        except Gateway.DoesNotExist:
            return ToggleGatewayStatus(
                gateway=None,
                success=False,
                massage=f"Gateway with id {id} does not exist"
            )
        except Exception as e:
            return ToggleGatewayStatus(
                success=False,
                massage=str(e)
            )

# main class mutation
class Mutation(graphene.ObjectType):
    create_gateway = CreateGateway.Field()
    update_gateway = UpdateGateway.Field()
    delete_gateway = DeleteGateway.Field()
    toggle_gateway = ToggleGatewayStatus.Field()

Schema = graphene.Schema(query=Query, mutation=Mutation)