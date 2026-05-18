# home/controllers.py

from . import views

def index_controller(request):
    return views.index(request)

def home_controller(request):
    return views.home_view(request)

def factura_controller(request):
    return views.factura(request)

def guardar_factura_controller(request):
    return views.guardar_factura(request)

def login_controller(request):
    return views.login_view(request)

def obtener_datos_factura_controller(request):
    return views.obtener_datos_factura(request)