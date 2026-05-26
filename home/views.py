from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from io import BytesIO

from .models import Cliente
from .bridge import FacturaDB

import json
import uuid
import random

from datetime import datetime

from xhtml2pdf import pisa
from io import BytesIO
from django.template.loader import render_to_string
from django.http import HttpResponse
import json
from django.conf import settings
import os
# =========================
# GENERAR NOMBRE FACTURA
# =========================

def generar_nombre_factura(rfc, serie, folio):

    fecha = datetime.now().strftime("%Y%m%d")

    uuid_corto = str(uuid.uuid4())[:6]

    return (
        f"{rfc}_"
        f"{serie}{folio}_"
        f"{fecha}_"
        f"{uuid_corto}.pdf"
    )


# =========================
# VISTAS
# =========================

def index(request):

    return render(
        request,
        "home/index.html",
        {}
    )


def home_view(request):

    return render(
        request,
        "home/home.html",
        {}
    )


def factura(request):

    return render(
        request,
        "home/factura.html",
        {}
    )


def historial(request):

    return render(
        request,
        "home/historial.html",
        {}
    )


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

            user = Cliente.objects.get(
                rfc__iexact=rfc
            )

            if user.password == password:

                # GUARDAR SESION
                request.session["cliente_id"] = user.id
                request.session["cliente_nombre"] = user.nombre
                request.session["cliente_rfc"] = user.rfc

                return JsonResponse({

                    "ok": True,

                    "nombre":
                    user.nombre,

                    "rfc":
                    user.rfc

                })

            else:

                return JsonResponse({

                    "ok": False,

                    "mensaje":
                    "Contraseña incorrecta"

                })

        except Cliente.DoesNotExist:

            return JsonResponse({

                "ok": False,

                "mensaje":
                "Usuario no existe"

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

        try:

            # =========================
            # JSON
            # =========================

            data = json.loads(request.body)

            print("DATOS RECIBIDOS:", data)

            # =========================
            # DATOS DINAMICOS
            # =========================

            rfc = (
                data.get(
                    "rfcEmisor",
                    "XAXX010101000"
                )
                .replace(" ", "")
                .upper()
            )

            serie = data.get(
                "serie",
                "A"
            )

            folio = str(
                data.get(
                    "folio",
                    "0001"
                )
            )

            # =========================
            # NOMBRE ARCHIVO
            # =========================

            nombre_archivo = generar_nombre_factura(

                rfc,
                serie,
                folio

            )

            print(
                "ARCHIVO:",
                nombre_archivo
            )

            # =========================
            # BASE DATOS
            # =========================

            db = FacturaDB()

            # =========================
            # FORMATO main.js
            # =========================

            if "rfcEmisor" in data:

                nueva_factura = db.guardar({

                    "rfcEmisor":
                    data.get("rfcEmisor"),

                    "nombreEmisor":
                    data.get("nombreEmisor"),

                    "rfcReceptor":
                    data.get("rfcReceptor"),

                    "nombreReceptor":
                    data.get("nombreReceptor"),

                    "folio":
                    data.get("folio"),

                    "clave":
                    data.get("clave"),

                    "subtotal":
                   float(data.get("subtotal", 0) or 0),

                    "iva":
                    float(data.get("iva", 0) or 0),

                    "total":
                    float(data.get("total", 0) or 0 ),

                    "claveConcepto":
                    data.get("claveConcepto"),

                    "descripcion":
                    data.get("descripcion"),

                    "cantidad":
                    data.get("cantidad"),

                    "precio":
                    data.get("precio"),

                    "importe":
                    float(data.get("importe", 0) or 0),

                })

            # =========================
            # FORMATO Factura.js
            # =========================

            else:

                cliente = data.get("cliente")

                factura = data.get("factura")

                conceptos = data.get("conceptos")

                nueva_factura = db.guardar({

                    "rfcEmisor":
                    cliente.get("rfc"),

                    "nombreEmisor":
                    cliente.get("nombre"),

                    "rfcReceptor":
                    cliente.get("rfc"),

                    "nombreReceptor":
                    cliente.get("nombre"),

                    "folio":
                    factura.get("folio"),

                    "clave":
                    "AUTO-" + str(
                        factura.get("folio")
                    ),

                    "subtotal":
                    factura.get("total"),

                    "iva":
                    factura.get("total") * 0.16,

                    "total":
                    factura.get("total"),

                    "claveConcepto":
                    "001",

                    "descripcion":
                    conceptos[0].get(
                        "descripcion"
                    ),

                    "cantidad":
                    conceptos[0].get(
                        "cantidad"
                    ),

                    "precio":
                    conceptos[0].get(
                        "precio"
                    ),

                    "importe":
                    conceptos[0].get(
                        "importe"
                    )

                })

            # =========================
            # RESPUESTA
            # =========================

            return JsonResponse({

                "ok": True,

                "id":
                nueva_factura.id,

                "archivo":
                nombre_archivo

            })

        except Exception as e:

            print("ERROR:", e)

            return JsonResponse({

                "ok": False,

                "error":
                str(e)

            })

    return JsonResponse({
        "ok": False
    })


# =========================
# DATOS FACTURA
# =========================

@csrf_exempt
def obtener_datos_factura(request):

    rfc = request.GET.get("rfc")

    try:

        cliente = Cliente.objects.get(
            rfc__iexact=rfc
        )

        receptores = list(

            Cliente.objects.exclude(
                rfc=cliente.rfc
            )

        )

        receptor = random.choice(
            receptores
        )

        datos = {

            "emisor": {

                "rfc":
                cliente.rfc,

                "nombre":
                cliente.nombre

            },

            "receptor": {

                "rfc":
                receptor.rfc,

                "nombre":
                receptor.nombre

            }

        }

        return JsonResponse(datos)

    except Cliente.DoesNotExist:

        return JsonResponse({

            "error":
            "Cliente no encontrado"

        })
        

# =========================
# PDF FACTURA
# =========================

@csrf_exempt
def generar_pdf(request):

    if request.method != "POST":
        return HttpResponse(status=405)

    data = json.loads(request.body)

    html = render_to_string(

        "PDF/factura_sat.html",

        {

            "factura": {

                "serie":
                data.get("serie"),

                "folio":
                data.get("folio"),

                "uuid":
                str(uuid.uuid4()),

                "fecha":
                data.get("fecha"),

                "nombre_emisor":
                request.session.get(
                    "cliente_nombre",
                    data.get("nombreEmisor")
                ),

                "rfc_emisor":
                request.session.get(
                    "cliente_rfc",
                    data.get("rfcEmisor")
                ),

                "nombre_receptor":
                data.get("nombreReceptor"),

                "rfc_receptor":
                data.get("rfcReceptor"),

                "subtotal":
                float(data.get("subtotal", 0) or 0),

                "iva":
                float(data.get("iva", 0) or 0),

                "total":
                float(data.get("total", 0) or 0),

                "conceptos": [

                    {

                        "clave":
                        data.get("claveConcepto"),

                        "descripcion":
                        data.get("descripcion"),

                        "cantidad":
                        float(
                            data.get(
                                "cantidad",
                                0
                            ) or 0
                        ),

                        "valor_unitario":
                        float(
                            data.get(
                                "precio",
                                0
                            ) or 0
                        ),

                        "importe":
                        float(
                            data.get(
                                "importe",
                                0
                            ) or 0
                        )

                    }

                ]

            },

            "qr_base64":
            data.get("qr", "")

        }

    )

    resultado = BytesIO()

    def link_callback(uri, rel):

        if uri.startswith(settings.STATIC_URL):

            ruta = uri.replace(
                settings.STATIC_URL,
                ""
            )

            return os.path.join(
                settings.BASE_DIR,
                "static",
                ruta
            )

        return uri


    pdf = pisa.CreatePDF(

        html,

        dest=resultado,

        link_callback=link_callback

    )

    if pdf.err:

        return HttpResponse(

            "Error generando PDF",

            status=500

        )

    nombre = generar_nombre_factura(

        request.session.get(
            "cliente_rfc",
            data.get(
                "rfcEmisor",
                "XAXX010101000"
            )
        ),

        str(
            data.get(
                "serie",
                "A"
            )
        ),

        str(
            data.get(
                "folio",
                "0001"
            )
        )

    )

    print("PDF:", nombre)

    response = HttpResponse(

        resultado.getvalue(),

        content_type="application/pdf"

    )

    response["Content-Disposition"] = (

        f'attachment; filename="{nombre}"'

    )

    return response