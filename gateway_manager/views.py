from django.shortcuts import render

def list_gateways(request):
    return render(request, 'gateway_manager/list.html')

def detail_gateway(request, gateway_id):
    return render(request, 'gateway_manager/detail.html')
