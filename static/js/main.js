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

//state
import { FacturaState } from './state/FacturaState.js';
let facturaEstado = new FacturaState();
function actualizarEstadoVisual(){

    const estadoHTML = document.getElementById("estadoFactura");
    if(!estadoHTML) return;

    const estado = facturaEstado.obtenerEstado();

    estadoHTML.innerText = estado;

    estadoHTML.style.color =
        estado === "Pendiente" ? "orange" :
        estado === "Timbrada" ? "blue" :
        estado === "Pagada" ? "green" :
        estado === "Cancelada" ? "red" : "black";
}
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

    // GUARDAR RFC
    localStorage.setItem("rfc", rfc);

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

// ==================== TIMBRAR ====================

window.timbrarFactura = function(){

    facturaEstado.siguiente();

    actualizarEstadoVisual();

    // UUID
    const uuid = generarUUID();

    // FECHA
    const fecha =
        new Date().toLocaleString();

    // SELLO
    const sello =
        generarSello();

    // CADENA
    const cadena =
        generarCadena({

            uuid: uuid,

            fecha: fecha,

            total:
                document.getElementById("total").innerText,

            rfc:
                document.getElementById("rfcEmisor").innerText
        });

    // MOSTRAR
    document.getElementById("uuid")
        .innerText = uuid;

    document.getElementById("fechaTimbrado")
        .innerText = fecha;

    document.getElementById("selloDigital")
        .value = sello;

    document.getElementById("cadenaOriginal")
        .value = cadena;

    mostrarModal("Factura Timbrada");
}

// ==================== PAGAR ====================

window.pagarFactura = function(){

    facturaEstado.pagar();

    actualizarEstadoVisual();

    mostrarModal("Factura Pagada");
}

// ==================== CANCELAR ====================

window.cancelarFactura = function(){

    facturaEstado.cancelar();

    actualizarEstadoVisual();

    mostrarModal("Factura Cancelada");
}

//====================== Timbrar ==============================
function generarUUID(){

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function(c){

        const r = Math.random() * 16 | 0;

        const v = c === 'x'
            ? r
            : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

function generarCadena(datos){

    return `||1.1|${datos.uuid}|${datos.fecha}|${datos.total}|${datos.rfc}|SAT||`;
}

//=================== Sello digital ===========================
function generarSello(){

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let sello = "";

    for(let i = 0; i < 250; i++){

        sello += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return sello;
}

// ====================== Modal ======================
function mostrarModal(texto){

    document.getElementById("tituloModal")
        .innerText = texto;

    document.getElementById("modalEstado")
        .style.display = "flex";
}

window.cerrarModal = function(){

    document.getElementById("modalEstado")
        .style.display = "none";
}


// ==================== CARGAR FACTURA ====================
window.cargarFactura = async function(){

    console.log("ENTRANDO A CARGAR FACTURA");

    const d = await generarFacturaAleatoria();

    console.log("DATOS:", d);

    const uuid = generarUUID();
    const fecha = new Date().toLocaleString();
    const sello = generarSello();

    document.getElementById("uuid").value = uuid;
    document.getElementById("fechaTimbrado").value = fecha;
    document.getElementById("selloDigital").value = sello;

    document.getElementById("cadenaOriginal").value =
    generarCadena({
        uuid,
        fecha,
        total: d.total,
        rfc: d.rfcEmisor
    });
    const fechaTimbrado = new Date().toLocaleString();
    const selloDigital = generarSello();

    const cadenaOriginal = generarCadena({
    uuid,
    fecha: fechaTimbrado,
    total: d.total,
    rfc: d.rfcEmisor
});
    if(!d) return;
    facturaEstado.siguiente();
    actualizarEstadoVisual();

    localStorage.setItem(
    "factura",
    JSON.stringify(d)
);
//

    //
    d.uuid = uuid;
    d.fechaTimbrado = fechaTimbrado;
    d.selloDigital = selloDigital;
    d.cadenaOriginal = cadenaOriginal;
    d.estado = "Timbrada";
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
    document.getElementById("iva").innerText ="$" + Number(d.iva).toFixed(2);
    document.getElementById("total").innerText ="$" + Number(d.total).toFixed(2);
    
    //Cadena
    document.getElementById("uuid").value = uuid;
    document.getElementById("fechaTimbrado").value = fechaTimbrado;
    document.getElementById("selloDigital").value = selloDigital;
    document.getElementById("cadenaOriginal").value = cadenaOriginal;
    //  GUARDAR EN BD (AQUÍ VA EL FETCH)
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
