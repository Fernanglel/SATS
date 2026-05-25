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

    localStorage.setItem( "nombre", data.nombre
);
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
    console.log(
"NOMBRE GUARDADO:",
localStorage.getItem(
"nombre"
)
);

console.log(
"RFC GUARDADO:",
localStorage.getItem(
"rfc"
)
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

const contenedor =
document.getElementById(
"tiposFactura"
);

if(!contenedor) return;

contenedor.innerHTML="";

const tipos={

Ingreso:{
color:"SATcolor",
icono:"/static/icons/Ingreso.png",
desc: "Factura estándar para venta de productos o servicios"
},

Egreso:{
color:"SATcolor",
icono:"/static/icons/egreso.png",
desc:"Para devoluciones"
},

Nomina:{
color:"SATcolor",
icono:"/static/icons/nomina.png",
desc:"Para devoluciones"
},
Empresarial:{
color:"SATcolor",
icono:"/static/icons/traslado.png",
desc:"Movimiento de mercancías"
}


};


const lista=
obtenerOpcionesFactura();

lista.forEach(op=>{

const t=
tipos[op]||

{

color:"azul",

icono:"📄",

desc:
"Genera documentos fiscales"

};

contenedor.innerHTML += `
<div class="card">

<div class="card-cover ${t.color}">

<img
src="${t.icono}"
class="tipo-icono">

</div>

<div class="card-body">

<h3>${op}</h3>

<p>${t.desc}</p>

<button
onclick="
irFactura('${op}')
">

Generar Factura

</button>

</div>

</div>
`;
});

}

// ==================== Formulario timbrado ====================
function validarFormulario(){

const form =
document.getElementById(
"formFactura"
);

if(!form){

return true;

}

if(
!form.checkValidity()
){

form.reportValidity();

return false;

}

return true;

}
// ==================== IR A FACTURA ====================

window.irFactura = function(tipo = null){

    if(tipo){

        localStorage.setItem(
            "tipoFactura",
            tipo
        );

        window.location.href =
            "/factura/";

        return;
    }

    const seleccion =
        document.querySelector(
            "input[name='tipoFactura']:checked"
        )?.value;

    if(!seleccion) return;

    localStorage.setItem(
        "tipoFactura",
        seleccion
    );

    window.location.href =
        "/factura/";
}

// ==================== TIMBRAR ====================
window.timbrarFactura=function(){

if(
!validarFormulario()
){

return;

}



const uuid=
generarUUID();

const fecha=
new Date()
.toLocaleString();

document
.getElementById(
"uuid"
)
.value=
uuid;

document
.getElementById(
"fechaTimbrado"
)
.value=
fecha;

document
.getElementById(
"selloDigital"
)
.value=
generarSello();

document
.getElementById(
"cadenaOriginal"
)
.value=
generarCadena({

uuid,

fecha,

total:
document
.getElementById(
"total"
)
?.innerText

||

"$0",

rfc:
localStorage
.getItem(
"rfc"
)

||

""

});

alert(
"Factura Timbrada"
);

}



// ==================== PAGAR ====================

window.pagarFactura = function(){

    facturaEstado.pagar();

    actualizarEstadoVisual();

    mostrarModal("Factura Pagada");
}

// ==================== CANCELAR ====================

window.cancelarFactura =
function(){

facturaEstado.cancelar();

actualizarEstadoVisual();

document
.getElementById(
"uuid"
)
.value="";

document
.getElementById(
"fechaTimbrado"
)
.value="";

document
.getElementById(
"selloDigital"
)
.value="";

document
.getElementById(
"cadenaOriginal"
)
.value="";

mostrarModal(
"Factura Cancelada"
);

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

const modal=
document.getElementById(
"modalEstado"
);

const titulo=
document.getElementById(
"tituloModal"
);

if(
modal
&&
titulo
){

titulo.innerText=
texto;

modal.style.display=
"flex";

}else{

alert(texto);

}

}

// ==================== CARGAR FACTURA ====================
window.cargarFactura = async function(){

    console.log("ENTRANDO A CARGAR FACTURA");

    const d = await generarFacturaAleatoria();

    // ==================== USUARIO LOGUEADO ====================

const rfcUsuario =
localStorage.getItem(
"rfc"
);

const nombreUsuario =
localStorage.getItem(
"nombre"
);

localStorage.setItem(
"factura",
JSON.stringify(d)
);

// RFC
const inputRFC =
document.getElementById(
"usuarioRFC"
);

if(inputRFC){

inputRFC.value =
rfcUsuario
||
"Sin RFC";

}

// NOMBRE
const inputNombre =
document.getElementById(
"usuarioNombre"
);

if(inputNombre){

inputNombre.value =
nombreUsuario
||
"Sin nombre";

}


    //Nueva generar factura 
    document.getElementById(
"nombreReceptor"
).value =
d.nombreReceptor;

document.getElementById(
"rfcReceptor"
).value =
d.rfcReceptor;

document.getElementById(
"descripcion"
).value =
d.descripcion;

document.getElementById(
"cantidad"
).value =
d.cantidad;

document.getElementById(
"precio"
).value =
d.precio;
    console.log("DATOS:", d);

   

    if(!d) return;

    localStorage.setItem(
    "factura",
    JSON.stringify(d)
);
//
// REINICIAR TIMBRADO VISUAL

facturaEstado =
new FacturaState();

document
.getElementById(
"uuid"
)
.value="";

document
.getElementById(
"fechaTimbrado"
)
.value="";

document
.getElementById(
"selloDigital"
)
.value="";

document
.getElementById(
"cadenaOriginal"
)
.value="";

const estadoHTML =
document.getElementById(
"estadoFactura"
);

if(
estadoHTML
){

estadoHTML.innerText =
"Pendiente";

estadoHTML.style.color =
"orange";

}
   
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
    document.getElementById("uuid").value="";
    document.getElementById("fechaTimbrado").value="";
    document.getElementById("selloDigital").value="";
    document.getElementById("cadenaOriginal").value="";

const estado =document.getElementById("estadoFactura");

if(estado){

estado.innerText="Pendiente";

}
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


// ==================== ACTIVAR DECORADOR ====================

function activarDecorador(tipo){

if(
!validarFormulario()
){

return;

}

tipo =
String(
tipo
)
.toLowerCase();

console.log(
"Decorador seleccionado:",
tipo
);

// limpiar checks

document
.querySelectorAll(
".decoradoresOcultos input"
)
.forEach(
c =>
c.checked =
false
);

const checkbox =
document.querySelector(
`input[value="${tipo}"]`
);

if(
!checkbox
){

return;

}

checkbox.checked =
true;

window.generarDecoradores();

}


//==========================
// GENERADOR
//==========================
function generarDecoradores(){

console.log(
"Generando..."
);

let factura =
new Factura();

if(
document.querySelector(
'input[value="pdf"]'
)?.checked
){

factura =
new PDFDecorator(
factura
);

}

if(
document.querySelector(
'input[value="xml"]'
)?.checked
){

factura =
new XMLDecorator(
factura
);

}

if(
document.querySelector(
'input[value="json"]'
)?.checked
){

factura =
new JSONDecorator(
factura
);

}

if(
document.querySelector(
'input[value="txt"]'
)?.checked
){

factura =
new TXTDecorator(
factura
);

}

if(
document.querySelector(
'input[value="email"]'
)?.checked
){

factura =
new EmailDecorator(
factura
);

}

factura.generar();

}

//==========================
// EXPORTAR
//==========================

window.activarDecorador =
activarDecorador;

window.generarDecoradores =
generarDecoradores;

window.activarPDF =
() => activarDecorador("pdf");
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

// ==================== Llamados al decorator ====================
console.log("MAIN JS CARGADO");

//========================
// EXPORTAR A WINDOW
//========================

window.activarDecorador =
activarDecorador;

window.generarDecoradores =
generarDecoradores;

window.activarPDF =
() =>
activarDecorador(
"pdf"
);


