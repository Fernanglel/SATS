from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from django.conf import settings

from xhtml2pdf import pisa

from io import BytesIO
from datetime import datetime

from .models import Cliente
from .bridge import FacturaDB

import json
import uuid
import random
import os
import base64
import qrcode
import io


# =========================================================
# GENERAR NOMBRE PDF
# =========================================================

def generar_nombre_factura(rfc, serie, folio):

    fecha = datetime.now().strftime("%Y%m%d")
    uuid_corto = str(uuid.uuid4())[:6]

    return f"{rfc}_{serie}{folio}_{fecha}_{uuid_corto}.pdf"


# =========================================================
# VISTAS
# =========================================================

def index(request):
    return render(request, "home/index.html", {})


def home_view(request):
    return render(request, "home/home.html", {})


def factura(request):
    return render(request, "home/factura.html", {})


def historial(request):
    return render(request, "home/historial.html", {})


# =========================================================
# LOGIN
# =========================================================

@csrf_exempt
def login_view(request):

    if request.method == "POST":

        rfc = request.POST.get("rfc")
        password = request.POST.get("password")

        try:
            user = Cliente.objects.get(rfc__iexact=rfc)

            if user.password == password:

                request.session["cliente_id"] = user.id
                request.session["cliente_nombre"] = user.nombre
                request.session["cliente_rfc"] = user.rfc

                return JsonResponse({
                    "ok": True,
                    "nombre": user.nombre,
                    "rfc": user.rfc
                })

            return JsonResponse({
                "ok": False,
                "mensaje": "Contraseña incorrecta"
            })

        except Cliente.DoesNotExist:
            return JsonResponse({
                "ok": False,
                "mensaje": "Usuario no existe"
            })

    return JsonResponse({"ok": False})


# =========================================================
# GUARDAR FACTURA
# =========================================================

@csrf_exempt
def guardar_factura(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            rfc = (data.get("rfcEmisor", "XAXX010101000")
                   .replace(" ", "")
                   .upper())

            serie = data.get("serie", "A")
            folio = str(data.get("folio", "0001"))

            nombre_archivo = generar_nombre_factura(rfc, serie, folio)

            db = FacturaDB()

            nueva_factura = db.guardar({
                "rfcEmisor": data.get("rfcEmisor"),
                "nombreEmisor": data.get("nombreEmisor"),
                "rfcReceptor": data.get("rfcReceptor"),
                "nombreReceptor": data.get("nombreReceptor"),
                "folio": data.get("folio"),
                "clave": data.get("clave"),
                "subtotal": float(data.get("subtotal", 0) or 0),
                "iva": float(data.get("iva", 0) or 0),
                "total": float(data.get("total", 0) or 0),
                "claveConcepto": data.get("claveConcepto"),
                "descripcion": data.get("descripcion"),
                "cantidad": float(data.get("cantidad", 0) or 0),
                "precio": float(data.get("precio", 0) or 0),
                "importe": float(data.get("importe", 0) or 0)
            })

            return JsonResponse({
                "ok": True,
                "id": nueva_factura.id,
                "archivo": nombre_archivo
            })

        except Exception as e:
            return JsonResponse({
                "ok": False,
                "error": str(e)
            })

    return JsonResponse({"ok": False})


# =========================================================
# OBTENER DATOS FACTURA
# =========================================================

@csrf_exempt
def obtener_datos_factura(request):

    rfc = request.GET.get("rfc")

    try:
        cliente = Cliente.objects.get(rfc__iexact=rfc)

        receptores = list(Cliente.objects.exclude(rfc=cliente.rfc))
        receptor = random.choice(receptores)

        return JsonResponse({
            "emisor": {
                "rfc": cliente.rfc,
                "nombre": cliente.nombre
            },
            "receptor": {
                "rfc": receptor.rfc,
                "nombre": receptor.nombre
            }
        })

    except Cliente.DoesNotExist:
        return JsonResponse({"error": "Cliente no encontrado"})


# =========================================================
# GENERAR PDF CFDI
# =========================================================

@csrf_exempt
def generar_pdf(request):

    if request.method != "POST":
        return HttpResponse(status=405)

    data = json.loads(request.body)

    uuid_factura = str(uuid.uuid4()).upper()
    fecha_timbrado = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    total = float(data.get("total", 0) or 0)
    subtotal = float(data.get("subtotal", 0) or 0)
    iva = float(data.get("iva", 0) or 0)

    rfc_emisor = request.session.get("cliente_rfc", data.get("rfcEmisor"))
    nombre_emisor = request.session.get("cliente_nombre", data.get("nombreEmisor"))

    rfc_receptor = data.get("rfcReceptor")
    nombre_receptor = data.get("nombreReceptor")

    sello_digital = (
        uuid.uuid4().hex.upper() +
        uuid.uuid4().hex.upper() +
        uuid.uuid4().hex.upper()
    )

    sello_final = sello_digital[-8:]

    cadena_original = (
        f"||1.1|{uuid_factura}|{fecha_timbrado}|"
        f"{total:.2f}|{rfc_emisor}|{rfc_receptor}||"
    )

    # =====================================================
    # QR (CORREGIDO - BIEN INDENTADO)
    # =====================================================

    url_qr = (
        "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx"
        f"?id={uuid_factura}"
        f"&re={rfc_emisor}"
        f"&rr={rfc_receptor}"
        f"&tt={total:.2f}"
        f"&fe={sello_final}"
    )

    qr = qrcode.make(url_qr)

    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")

    qr_base64 = "data:image/png;base64," + base64.b64encode(
        buffer.getvalue()
    ).decode()

    html = render_to_string("PDF/factura_sat.html", {
        "factura": {
            "serie": data.get("serie"),
            "folio": data.get("folio"),
            "uuid": uuid_factura,
            "fecha": data.get("fecha"),
            "fecha_timbrado": fecha_timbrado,

            "nombre_emisor": nombre_emisor,
            "rfc_emisor": rfc_emisor,

            "nombre_receptor": nombre_receptor,
            "rfc_receptor": rfc_receptor,

            "subtotal": subtotal,
            "iva": iva,
            "total": total,

            "sello_digital": sello_digital,
            "cadena_original": cadena_original,

            "conceptos": [{
                "clave": data.get("claveConcepto"),
                "descripcion": data.get("descripcion"),
                "cantidad": float(data.get("cantidad", 0) or 0),
                "valor_unitario": float(data.get("precio", 0) or 0),
                "importe": float(data.get("importe", 0) or 0)
            }]
        },
        "qr_base64": qr_base64
    })

    resultado = BytesIO()

    def link_callback(uri, rel):
        if uri.startswith(settings.STATIC_URL):
            ruta = uri.replace(settings.STATIC_URL, "")
            return os.path.join(settings.BASE_DIR, "static", ruta)
        return uri

    pdf = pisa.CreatePDF(html, dest=resultado, link_callback=link_callback)

    if pdf.err:
        return HttpResponse("Error generando PDF", status=500)

    nombre = generar_nombre_factura(
        rfc_emisor,
        str(data.get("serie", "A")),
        str(data.get("folio", "0001"))
    )

    response = HttpResponse(resultado.getvalue(), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{nombre}"'

    return response