// ====================
// NOMBRE PROFESIONAL
// ====================

function generarNombreArchivo(d){

    const rfc = (
        d.rfcEmisor || "XAXX010101000"
    )
    .replace(/\s+/g, "")
    .toUpperCase();

    const serie = d.serie || "A";

    const folio = d.folio || "0001";

    const fecha = (
        d.fecha ||
        new Date()
        .toISOString()
        .slice(0,10)
        .replace(/-/g,"")
    );

    return `${rfc}_${serie}${folio}_${fecha}`;
}


// ====================
// DESCARGA BASE
// ====================

export function descargarArchivo(
    contenido,
    nombre,
    tipo
){

    const blob = new Blob(
        [contenido],
        { type: tipo }
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download = nombre;

    a.click();
}


// ====================
// XML
// ====================

export function descargarXML(){

    const factura =
    localStorage.getItem("factura");

    if(!factura){

        alert(
            "Primero genera una factura"
        );

        return;

    }

    const d = JSON.parse(factura);

    const nombre =
    generarNombreArchivo(d);

    const xml = `

<factura>

    <emisor>

        <nombre>
            ${d.nombreEmisor}
        </nombre>

        <rfc>
            ${d.rfcEmisor}
        </rfc>

    </emisor>

    <receptor>

        <nombre>
            ${d.nombreReceptor}
        </nombre>

        <rfc>
            ${d.rfcReceptor}
        </rfc>

    </receptor>

    <datos>

        <folio>
            ${d.folio}
        </folio>

        <clave>
            ${d.clave}
        </clave>

        <fecha>
            ${d.fecha}
        </fecha>

        <descripcion>
            ${d.descripcion}
        </descripcion>

    </datos>

    <concepto>

        <cantidad>
            ${d.cantidad}
        </cantidad>

        <precio>
            ${d.precio}
        </precio>

        <importe>
            ${d.importe}
        </importe>

    </concepto>

    <totales>

        <subtotal>
            ${d.subtotal}
        </subtotal>

        <iva>
            ${d.iva}
        </iva>

        <total>
            ${d.total}
        </total>

    </totales>

</factura>

`;

    descargarArchivo(

        xml,

        `${nombre}.xml`,

        "text/xml"

    );

}


// ====================
// JSON
// ====================

export function descargarJSON(){

    const factura =
    localStorage.getItem("factura");

    if(!factura){

        alert(
            "Primero genera una factura"
        );

        return;

    }

    const d = JSON.parse(factura);

    const nombre =
    generarNombreArchivo(d);

    descargarArchivo(

        factura,

        `${nombre}.json`,

        "application/json"

    );

}


// ====================
// TXT
// ====================

export function descargarTXT(){

    const factura =
    localStorage.getItem("factura");

    if(!factura){

        alert(
            "Primero genera una factura"
        );

        return;

    }

    const d = JSON.parse(factura);

    const nombre =
    generarNombreArchivo(d);

    const txt = `

FACTURA

Folio: ${d.folio}
Clave: ${d.clave}
Fecha: ${d.fecha}

EMISOR:
${d.nombreEmisor}
(${d.rfcEmisor})

RECEPTOR:
${d.nombreReceptor}
(${d.rfcReceptor})

CONCEPTO:
${d.descripcion}

Cantidad:
${d.cantidad}

Precio:
$${d.precio}

Importe:
$${d.importe}

TOTALES:

Subtotal:
$${d.subtotal}

IVA:
$${d.iva}

TOTAL:
$${d.total}

`;

    descargarArchivo(

        txt,

        `${nombre}.txt`,

        "text/plain"

    );

}


// ====================
// PDF
// ====================

export async function descargarPDF(){

try{

const cantidad = Number(
document.getElementById("cantidad")?.value || 0
);

const precio = Number(
document.getElementById("precio")?.value || 0
);

const subtotal =
cantidad * precio;

const iva =
subtotal * 0.16;

const total =
subtotal + iva;


const data={

serie:
document.getElementById("serie")?.value || "A",

folio:
document.getElementById("folio")?.value || "",

fecha:
document.getElementById("fecha")?.value || "",

nombreEmisor:
document.getElementById("nombreEmisor")?.value || "",

rfcEmisor:
document.getElementById("rfcEmisor")?.value || "",

nombreReceptor:
document.getElementById("nombreReceptor")?.value || "",

rfcReceptor:
document.getElementById("rfcReceptor")?.value || "",

claveConcepto:
document.getElementById("claveConcepto")?.value || "",

descripcion:
document.getElementById("descripcion")?.value || "",

cantidad,

precio,

importe:
subtotal,

subtotal,

iva,

total

};


const response=

await fetch(

"/generar-pdf/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(data)

}

);

if(!response.ok){

throw new Error(
"Error generando PDF"
);

}

// ====================
// DESCARGAR CON NOMBRE
// ====================

const blob =
await response.blob();

const url =
URL.createObjectURL(
    blob
);

let nombre =
"FacturaSAT.pdf";

const disposition =

response.headers.get(
    "Content-Disposition"
);

if(disposition){

    const match =

    disposition.match(
        /filename="?([^"]+)"?/
    );

    if(

        match &&
        match[1]

    ){

        nombre =
        match[1];

    }

}

const link =

document.createElement(
"a"
);

link.href =
url;

link.download =
nombre;

document.body.appendChild(
link
);

link.click();

link.remove();

URL.revokeObjectURL(
url);

}

catch(error){

console.error(error);

alert(
"No se pudo generar PDF"
);

}

}
// ====================
// QR
// ====================

export function generarYDescargarQR(){

    const factura =
    localStorage.getItem("factura");

    if(!factura){

        alert(
            "Primero genera una factura"
        );

        return;

    }

    const d = JSON.parse(factura);

    const nombre =
    generarNombreArchivo(d);

    const texto = `

FACTURA

Folio: ${d.folio}

Clave: ${d.clave}

Fecha: ${d.fecha}

EMISOR:
${d.nombreEmisor}
(${d.rfcEmisor})

RECEPTOR:
${d.nombreReceptor}
(${d.rfcReceptor})

TOTAL:
$${d.total}

`;

    const url =

    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(texto)}`;

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    `QR_${nombre}.png`;

    a.click();

}


export function enviarEmail(){

    const facturaGuardada =
    localStorage.getItem("factura");

    if(!facturaGuardada){

        alert("No hay factura");

        return;

    }

    const factura =
    JSON.parse(facturaGuardada);

    // ====================
    // ASUNTO
    // ====================

    const asunto =

    `Factura SAT ${factura.serie || "A"}${factura.folio} - ${factura.nombreReceptor}`;

    // ====================
    // CUERPO
    // ====================

    const cuerpo = `

FACTURA CFDI

Folio:
${factura.folio}

Clave:
${factura.clave}

Fecha:
${factura.fecha}

====================

EMISOR:
${factura.nombreEmisor}

RFC:
${factura.rfcEmisor}

====================

RECEPTOR:
${factura.nombreReceptor}

RFC:
${factura.rfcReceptor}

====================

CONCEPTO:
${factura.descripcion}

Cantidad:
${factura.cantidad}

Precio:
$${factura.precio}

Importe:
$${factura.importe}

====================

Subtotal:
$${factura.subtotal}

IVA:
$${factura.iva}

TOTAL:
$${factura.total}

`;

    // ====================
    // URL GMAIL
    // ====================

    const url =

    `https://mail.google.com/mail/?view=cm&fs=1`

    +

    `&su=${encodeURIComponent(asunto)}`

    +

    `&body=${encodeURIComponent(cuerpo)}`;

    // ====================
    // ABRIR GMAIL
    // ====================

    window.open(
        url,
        "_blank"
    );

}