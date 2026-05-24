from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Factura, Cliente, Concepto

admin.site.register(Factura)
admin.site.register(Cliente)
admin.site.register(Concepto)

