import {
    generarFolio,
    generarClave
}
from '../utils/generadores.js';

import {
    UsuarioFactory
}
from '../factory/UsuarioFactory.js';

// ==================== GENERAR FACTURA ====================

export async function generarFacturaAleatoria() {

    const rfc =
        localStorage.getItem("rfc");

    // CONSULTA A DJANGO
    const response =
        await fetch(
            `/obtener-datos-factura/?rfc=${rfc}`
        );

    const bd =
        await response.json();

    console.log("DATOS BD:", bd);

    const cantidad =
        Math.floor(Math.random() * 10 + 1);

    const precio =
        Math.floor(Math.random() * 500 + 50);

    const subtotal =
        cantidad * precio;

    const iva =
        subtotal * 0.16;

    const datos = {

        // EMISOR DESDE BD
        rfcEmisor:
            bd.emisor.rfc,

        nombreEmisor:
            bd.emisor.nombre,

        // RECEPTOR ALEATORIO DESDE BD
        rfcReceptor:
            bd.receptor.rfc,

        nombreReceptor:
            bd.receptor.nombre,

        descripcion:
            localStorage.getItem("tipoFactura") || "Ingreso",

        cantidad,
        precio,

        importe:
            subtotal,

        subtotal,

        iva,

        total:
            subtotal + iva,

        fecha:
            new Date().toLocaleString(),

        folio:
            generarFolio(),

        clave:
            generarClave()
    };

    localStorage.setItem(
        "factura",
        JSON.stringify(datos)
    );

    return datos;
}