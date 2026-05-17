import {
    generarFolio,
    generarClave,
    randomNombre,
    randomRFC
}
from '../utils/generadores.js';

import {
    UsuarioFactory
}
from '../factory/UsuarioFactory.js';

// ==================== GENERAR FACTURA ====================

export function generarFacturaAleatoria() {

    console.log(
        "TIPO USUARIO:",
        localStorage.getItem("tipoUsuario")
    );

    const tipoUsuario =
        localStorage.getItem("tipoUsuario");

    // FACTORY METHOD
    const usuario =
        UsuarioFactory.crearUsuario(tipoUsuario);

    console.log("USUARIO:", usuario);

    // GENERAR FACTURA
    const emisor =
        usuario.generarFactura();

    console.log("EMISOR:", emisor);

    // RECEPTOR
    const receptor = {

        rfc: randomRFC('fisica'),

        nombre: randomNombre()
    };

    // DATOS
    const cantidad =
        Math.floor(Math.random() * 10 + 1);

    const precio =
        Math.floor(Math.random() * 500 + 50);

    const subtotal =
        cantidad * precio;

    const iva =
        subtotal * 0.16;

    const datos = {

        rfcEmisor: emisor.rfc,
        nombreEmisor: emisor.nombre,

        rfcReceptor: receptor.rfc,
        nombreReceptor: receptor.nombre,

        descripcion:
            localStorage.getItem("tipoFactura")
            || "Ingreso",

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

    // LOCAL STORAGE
    localStorage.setItem(
        "factura",
        JSON.stringify(datos)
    );

    return datos;
}