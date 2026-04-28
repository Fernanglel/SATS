from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
from django.shortcuts import render

def index(request):
    return render(request, "home/index.html", {})

def home_view(request):
    return render(request, 'home/home.html', {})

def factura(request):
    return render(request, 'home/factura.html', {})

# Uso de la Base de datos, que es el  bridge en los datos ojo
import json
from django.http import JsonResponse
from .models import Cliente

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

        rfc = data.get("rfc")
        password = data.get("password")

        try:
            user = Cliente.objects.get(rfc=rfc)

            if user.password == password:
                return JsonResponse({"ok": True})
            else:
                return JsonResponse({"ok": False, "mensaje": "Contraseña incorrecta"})

        except Cliente.DoesNotExist:
            return JsonResponse({"ok": False, "mensaje": "Usuario no existe"})
        
import json
from django.http import JsonResponse
from .bridge import FacturaDB

def guardar_factura(request):
    if request.method == "POST":
        data = json.loads(request.body)

        db = FacturaDB()
        factura = db.guardar(data)

        return JsonResponse({"ok": True, "id": factura.id})