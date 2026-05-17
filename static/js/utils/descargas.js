// ==================== DESCARGA BASE ====================

export function descargarArchivo(contenido,nombre,tipo){
    const blob=new Blob([contenido],{type:tipo});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=nombre;
    a.click();
}

// ==================== FORMATOS ====================
// ==================== XML ====================

export function descargarXML(){
    const d = JSON.parse(localStorage.getItem("factura"));

    const xml = `<factura>
    <emisor>
        <nombre>${d.nombreEmisor}</nombre>
        <rfc>${d.rfcEmisor}</rfc>
    </emisor>
    <receptor>
        <nombre>${d.nombreReceptor}</nombre>
        <rfc>${d.rfcReceptor}</rfc>
    </receptor>
    <datos>
        <folio>${d.folio}</folio>
        <clave>${d.clave}</clave>
        <fecha>${d.fecha}</fecha>
        <descripcion>${d.descripcion}</descripcion>
    </datos>
    <concepto>
        <cantidad>${d.cantidad}</cantidad>
        <precio>${d.precio}</precio>
        <importe>${d.importe}</importe>
    </concepto>
    <totales>
        <subtotal>${d.subtotal}</subtotal>
        <iva>${d.iva}</iva>
        <total>${d.total}</total>
    </totales>
</factura>`;

    descargarArchivo(xml,"factura.xml","text/xml");
}

//JSON
export function descargarJSON(){
    descargarArchivo(localStorage.getItem("factura"),"factura.json","application/json");
}

// ==================== TXT ====================
export function descargarTXT(){
    const d = JSON.parse(localStorage.getItem("factura"));

    const txt = `
FACTURA

Folio: ${d.folio}
Clave: ${d.clave}
Fecha: ${d.fecha}

EMISOR:
${d.nombreEmisor} (${d.rfcEmisor})

RECEPTOR:
${d.nombreReceptor} (${d.rfcReceptor})

CONCEPTO:
${d.descripcion}
Cantidad: ${d.cantidad}
Precio: $${d.precio}
Importe: $${d.importe}

TOTALES:
Subtotal: $${d.subtotal}
IVA: $${d.iva}
TOTAL: $${d.total}
`;

    descargarArchivo(txt,"factura.txt","text/plain");
}

// PDF
// ==================== DESCARGAR PDF ====================
export function descargarPDF(){

    const elemento = document.getElementById("facturaPDF");

    const opciones = {
        margin: 5,
        filename: 'Factura_SAT.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 }, // 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save();
}

//QR
export function generarYDescargarQR(){
    const d = JSON.parse(localStorage.getItem("factura"));

    const texto = `
FACTURA

Folio: ${d.folio}
Clave: ${d.clave}
Fecha: ${d.fecha}

EMISOR:
${d.nombreEmisor} (${d.rfcEmisor})

RECEPTOR:
${d.nombreReceptor} (${d.rfcReceptor})

CONCEPTO:
${d.descripcion}
Cantidad: ${d.cantidad}
Precio: $${d.precio}
Importe: $${d.importe}

TOTALES:
Subtotal: $${d.subtotal}
IVA: $${d.iva}
TOTAL: $${d.total}
`;

    
    const url=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(texto)}`; 
    const a=document.createElement("a"); 
    a.href=url; 
    a.download="qr_factura.png"; 
    a.click(); 
}

//Email
export function enviarEmail(){
    const d = JSON.parse(localStorage.getItem("factura"));

    const asunto = `Factura SAT - ${d.folio}`;

    const cuerpo = `
FACTURA

Folio: ${d.folio}
Clave: ${d.clave}
Fecha: ${d.fecha}

EMISOR:
${d.nombreEmisor} (${d.rfcEmisor})

RECEPTOR:
${d.nombreReceptor} (${d.rfcReceptor})

CONCEPTO:
${d.descripcion}
Cantidad: ${d.cantidad}
Precio: $${d.precio}
Importe: $${d.importe}

TOTALES:
Subtotal: $${d.subtotal}
IVA: $${d.iva}
TOTAL: $${d.total}
`;

    window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    );
}
