import graphene
import gateway_manager.schema as gateway_schema

class Query(gateway_schema.Query, graphene.ObjectType):
    """
    Root GraphQL Query class for the entire project.
    Inherits queries from individual apps.
    """
    pass

class Mutation(gateway_schema.Mutation, graphene.ObjectType):
    """
    Root GraphQL Mutation class for the entire project.
    Inherits mutations from individual apps.
    """
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)

