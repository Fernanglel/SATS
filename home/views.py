from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def index(request):
    return render(request, "home/index.html", {})

def home_view(request):
    return render(request, 'home/home.html', {})

def factura(request):
    return render(request, 'home/factura.html', {})
