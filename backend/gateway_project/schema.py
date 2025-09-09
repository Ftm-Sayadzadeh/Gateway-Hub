import graphene
from gateway_manager.schema import Query, Mutation
from gateway_manager.subscriptions import Subscription

schema = graphene.Schema(
    query=Query,
    mutation=Mutation, 
    subscription=Subscription
)