from django.urls import path
from gateway_manager import views

urlpatterns = [
    path('', views.list_gateways, name='gateways-list'),
    path('gateway/<int:gateway_id>/', views.detail_gateway, name='gateway_detail'),

]