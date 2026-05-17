console.log("MAIN JS CARGADO");
// ==================== IMPORTS ====================
// Servicios
import { loginUsuario } from '/static/js/services/authService.js';
import { obtenerOpcionesFactura } from '/static/js/services/opcionesFacturaService.js';
import { generarFacturaAleatoria } from '/static/js/services/facturaService.js';

// Decorator base
import { Factura } from '/static/js/decorators/Factura.js';

// Decoradores
import { PDFDecorator } from '/static/js/decorators/PDFDecorator.js';
import { XMLDecorator } from '/static/js/decorators/XMLDecorator.js';
import { JSONDecorator } from '/static/js/decorators/JSONDecorator.js';
import { TXTDecorator } from '/static/js/decorators/TXTDecorator.js';
import { QRDecorator } from '/static/js/decorators/QRDecorator.js';
import { EmailDecorator } from '/static/js/decorators/EmailDecorator.js';

//factory
import { UsuarioFactory } from './factory/UsuarioFactory.js';

// ==================== LOGIN ====================

window.login = async function () {

    const rfc = document
    .getElementById("usuario")
    .value
    .replace(/\s/g, "")
    .trim()
    .toUpperCase();

    const password = document
        .getElementById("password")
        .value;

    const response = await fetch("/login/", {

        method: "POST",

        headers: {
            "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body: new URLSearchParams({
            rfc,
            password
        })
    });

    const data = await response.json();

    // LOGIN CORRECTO
   if (data.ok) {

    // DETECTAR TIPO
    let tipoUsuario = "";

// PERSONA FISICA
if(rfc.length === 13){

    tipoUsuario = "fisica";
}

// PERSONA MORAL
else if(rfc.length === 12){

    tipoUsuario = "moral";
}

// RFC INVALIDO
else{

    alert("RFC inválido");
    return;
}
    // GUARDAR
    localStorage.setItem(
        "tipoUsuario",
        tipoUsuario
    );
    console.log("RFC:", rfc);
    console.log("LONGITUD:", rfc.length);
    console.log("TIPO:", tipoUsuario);
    // IR A HOME
    window.location.href = "/home/";
}
}



// ==================== OPCIONES ====================

window.mostrarOpcionesFactura = function(){

    const contenedor = document.getElementById("tiposFactura");

    // Si no existe el contenedor, no hace nada
    if(!contenedor) return;

    // Limpiar contenido
    contenedor.innerHTML = "<h3>Seleccione tipo de factura</h3>";

    // Obtener opciones según tipo de usuario
    const lista = obtenerOpcionesFactura();

    // Crear radios dinámicamente
    lista.forEach((op, i)=>{

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'tipoFactura';
        radio.value = op;

        // Primera opción seleccionada por defecto
        if(i === 0) radio.checked = true;

        const label = document.createElement('label');
        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + op));

        contenedor.appendChild(label);
        contenedor.appendChild(document.createElement("br"));
    });
};


// ==================== IR A FACTURA ====================

window.irFactura = function(){

    // Obtener opción seleccionada
    const seleccion = document.querySelector("input[name='tipoFactura']:checked")?.value;

    if(!seleccion) return;

    // Guardar en localStorage
    localStorage.setItem("tipoFactura", seleccion);

    // Redirigir
        window.location.href = "/factura/";

};

// ==================== CARGAR FACTURA ====================

window.cargarFactura = function(){

    console.log("ENTRANDO A CARGAR FACTURA");

    const d = generarFacturaAleatoria();

    console.log("DATOS:", d);

    if(!d) return;

    // EMISOR
    document.getElementById("rfcEmisor").innerText = d.rfcEmisor;
    document.getElementById("nombreEmisor").innerText = d.nombreEmisor;

    // INFO FACTURA
    document.getElementById("folio").innerText = d.folio;
    document.getElementById("clave").innerText = d.clave;
    document.getElementById("fecha").innerText = d.fecha;

    // RECEPTOR
    document.getElementById("rfcReceptor").innerText = d.rfcReceptor;
    document.getElementById("nombreReceptor").innerText = d.nombreReceptor;

    // CONCEPTOS
    document.getElementById("descripcion").innerText = d.descripcion;
    document.getElementById("cantidad").innerText = d.cantidad;
    document.getElementById("precio").innerText = "$" + d.precio;
    document.getElementById("importe").innerText = "$" + d.importe;

    // TOTALES
    document.getElementById("subtotal").innerText = "$" + d.subtotal;
    document.getElementById("iva").innerText = "$" + d.iva;
    document.getElementById("total").innerText = "$" + d.total;

    // 🔥 GUARDAR EN BD (AQUÍ VA EL FETCH)
    fetch("/guardar-factura/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            rfcEmisor: d.rfcEmisor,
            nombreEmisor: d.nombreEmisor,
            rfcReceptor: d.rfcReceptor,
            nombreReceptor: d.nombreReceptor,
            folio: d.folio,
            clave: d.clave,
            subtotal: d.subtotal,
            iva: d.iva,
            total: d.total,
            claveConcepto: d.clave,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            precio: d.precio,
            importe: d.importe
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("GUARDADO EN BD:", data);
    })
    .catch(err => {
        console.error("ERROR AL GUARDAR:", err);
    });
};


// ==================== DECORATORS ====================

window.generarDecoradores = function(){

    let d = JSON.parse(localStorage.getItem("factura"));
    let factura = new Factura(d);

    // Obtener seleccionados
    const seleccionados = Array.from(
        document.querySelectorAll("input[type=checkbox]:checked")
    ).map(c => c.value);

    // Mapa de decoradores
    const decoradores = {
        pdf: PDFDecorator,
        xml: XMLDecorator,
        json: JSONDecorator,
        txt: TXTDecorator,
        qr: QRDecorator,
        email: EmailDecorator
    };

    // Aplicar decoradores dinámicamente
    seleccionados.forEach(op => {
        factura = new decoradores[op](factura);
    });

    factura.generar();

    // Mostrar resultado
    document.getElementById("resultadoDecorador") &&
        (document.getElementById("resultadoDecorador").innerText =
            `Factura generada en: ${seleccionados.join(", ").toUpperCase()}`);
};


// ==================== INIT ====================

window.onload = () => {

    // Detecta en qué página estás

    // Página de opciones
    if(document.getElementById("tiposFactura")){
        mostrarOpcionesFactura();
    }

    // Página de factura
    if(document.getElementById("rfcEmisor")){
        cargarFactura();
    }
};

// ==================== EVENTOS ====================

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnLogin");

    if(btnLogin){
        btnLogin.addEventListener("click", () => {
            login();
        });
    }

});
