from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Cliente
from .bridge import FacturaDB
import json


# =========================
# VISTAS
# =========================

def index(request):
    return render(request, "home/index.html", {})


def home_view(request):
    return render(request, 'home/home.html', {})


def factura(request):
    return render(request, 'home/factura.html', {})


# =========================
# LOGIN
# =========================

@csrf_exempt
def login_view(request):

    if request.method == "POST":

        rfc = request.POST.get("rfc")
        password = request.POST.get("password")

        print("RFC:", rfc)
        print("PASSWORD:", password)

        try:

            user = Cliente.objects.get(rfc__iexact=rfc)

            if user.password == password:

                return JsonResponse({
                    "ok": True
                })

            else:

                return JsonResponse({
                    "ok": False,
                    "mensaje": "Contraseña incorrecta"
                })

        except Cliente.DoesNotExist:

            return JsonResponse({
                "ok": False,
                "mensaje": "Usuario no existe"
            })

    return JsonResponse({
        "ok": False
    })


# =========================
# GUARDAR FACTURA
# =========================

@csrf_exempt
def guardar_factura(request):

    if request.method == "POST":

        data = json.loads(request.body)

        db = FacturaDB()

        factura = db.guardar(data)

        return JsonResponse({
            "ok": True,
            "id": factura.id
        })

    return JsonResponse({
        "ok": False
    })