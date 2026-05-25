from django.db import models


# ==========================
# CLIENTES
# ==========================
class Cliente(models.Model):
    rfc = models.CharField(max_length=13, unique=True)
    nombre = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} - {self.rfc}"


# ==========================
# FACTURAS
# ==========================
class Factura(models.Model):
    archivo_pdf = models.FileField(
    upload_to="facturas/",
    null=True,
    blank=True
)
    folio = models.CharField(max_length=20, unique=True)

    csd = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    codigo_postal = models.CharField(
        max_length=5,
        null=True,
        blank=True
    )

    fecha = models.DateField(
    auto_now_add=True,
    null=True,
    blank=True
    )
    
    hora = models.TimeField(
    auto_now_add=True,
    null=True,
    blank=True
    
    )
    efecto_comprobante = models.CharField(
        max_length=5,
        null=True,
        blank=True
    )

    regimen_fiscal = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    cfdi = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    moneda = models.CharField(
        max_length=10,
        default='MXN'
    )

    forma_pago = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    metodo_pago = models.CharField(
        max_length=10,
        null=True,
        blank=True
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    impuesto = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

# ==========================
# CONCEPTOS
# ==========================
class Concepto(models.Model):

    factura = models.ForeignKey(
        Factura,
        on_delete=models.CASCADE,
        related_name='conceptos'
    )

    clave_producto = models.CharField(max_length=20)

    no_identificacion = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    cantidad = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True
    )

    unidad = models.CharField(
        max_length=30,
        null=True,
        blank=True
    )

    valor_unitario = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True
    )

    importe = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True
    )

    no_pedimento = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    no_cuenta_predial = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )