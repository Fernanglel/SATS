from django.db import models

# Create your models here.
from django.db import models

class Cliente(models.Model):
    rfc = models.CharField(max_length=13, unique=True)
    nombre = models.CharField(max_length=100)
    password = models.CharField(max_length=100)  # 🔥 nueva

    def __str__(self):
        return self.nombre


class Factura(models.Model):
    folio = models.CharField(max_length=20)
    clave = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)

    emisor = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='emisor')
    receptor = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='receptor')

    subtotal = models.FloatField()
    iva = models.FloatField()
    total = models.FloatField()


class Concepto(models.Model):
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    clave = models.CharField(max_length=20)
    descripcion = models.CharField(max_length=100)
    cantidad = models.IntegerField()
    precio = models.FloatField()
    importe = models.FloatField()