# ==================== INTERFAZ ====================
class FacturaImplementor:
    def guardar(self, factura_data):
        pass


# ==================== IMPLEMENTACIÓN CON BD ====================
from .models import Factura, Cliente, Concepto

class FacturaDB(FacturaImplementor):

    def guardar(self, data):

        emisor, _ = Cliente.objects.get_or_create(
            rfc=data["rfcEmisor"],
            nombre=data["nombreEmisor"]
        )

        receptor, _ = Cliente.objects.get_or_create(
            rfc=data["rfcReceptor"],
            nombre=data["nombreReceptor"]
        )

        factura = Factura.objects.create(
            folio=data["folio"],
            clave=data["clave"],
            emisor=emisor,
            receptor=receptor,
            subtotal=data["subtotal"],
            iva=data["iva"],
            total=data["total"]
        )

        Concepto.objects.create(
            factura=factura,
            clave=data["claveConcepto"],
            descripcion=data["descripcion"],
            cantidad=data["cantidad"],
            precio=data["precio"],
            importe=data["importe"]
        )

        return factura