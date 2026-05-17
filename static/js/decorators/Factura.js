export class Factura {

    constructor(datos){
        this.datos = datos;
    }

    async generar(){

        const cliente = {
            rfc: this.datos.rfcReceptor,
            nombre: this.datos.nombreReceptor,
            regimen: "General",
            cp: "00000"
        };

        const factura = {
            folio: this.datos.folio,
            total: this.datos.total,
            formaPago: "Efectivo",
            metodoPago: "PUE"
        };

        const conceptos = [
            {
                descripcion: this.datos.descripcion,
                cantidad: this.datos.cantidad,
                precio: this.datos.precio,
                importe: this.datos.importe
            }
        ];

        try {
            const res = await fetch("/guardar-factura/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario_id: 1,
                    cliente,
                    factura,
                    conceptos
                })
            });

            const data = await res.json();
            console.log("Factura guardada:", data);

        } catch (err) {
            console.error("Error al guardar factura:", err);
        }
    }
}