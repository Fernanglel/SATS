import { UsuarioFisica, UsuarioMoral } from '../bridge/Usuario.js';
import { generarFolio, generarClave, randomNombre, randomRFC } from '../utils/generadores.js';

// ==================== GENERAR FACTURA ====================

export function generarFacturaAleatoria() {

    console.log("TIPO USUARIO:", localStorage.getItem("tipoUsuario"));

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    const usuario = tipoUsuario === 'fisica'
        ? new UsuarioFisica()
        : new UsuarioMoral();

    console.log("USUARIO:", usuario);

    const emisor = usuario.generarFactura();

    console.log("EMISOR:", emisor);

    // Generamos receptor aleatorio
    const receptor = {
        rfc: randomRFC('fisica'),
        nombre: randomNombre()
    };

    // Datos de compra
    const cantidad = Math.floor(Math.random() * 10 + 1);
    const precio = Math.floor(Math.random() * 500 + 50);

    const subtotal = cantidad * precio;
    const iva = subtotal * 0.16;

    const datos = {
        rfcEmisor: emisor.rfc,
        nombreEmisor: emisor.nombre,
        rfcReceptor: receptor.rfc,
        nombreReceptor: receptor.nombre,
        descripcion: localStorage.getItem("tipoFactura") || "Ingreso",

        cantidad,
        precio,
        importe: subtotal,
        subtotal,
        iva,
        total: subtotal + iva,

        fecha: new Date().toLocaleString(),
        folio: generarFolio(),
        clave: generarClave()
    };

    // Guardamos en localStorage
    localStorage.setItem("factura", JSON.stringify(datos));

    return datos;
}