// ==================== DATOS ALEATORIOS ====================

// Genera un folio aleatorio
export function generarFolio(){
    return Math.floor(Math.random()*1000000);
}

// Genera una clave tipo SAT
export function generarClave(){
    return "FAC-" + Math.floor(Math.random()*999999);
}

// Genera nombres aleatorios (persona o empresa)
export function randomNombre(tipo='persona'){
    const nombres=["Juan","María","Pedro","Lucía","Carlos","Ana","Luis","Sofía"];
    const apellidos=["Pérez","García","Hernández","López","Martínez","Rodríguez"];

    if(tipo==='empresa'){
        return ["ACME S.A.","TechCorp","Servicios Globales","Innova Ltd.","Soluciones MX"]
            [Math.floor(Math.random()*5)];
    }

    return nombres[Math.floor(Math.random()*nombres.length)] + " " +
           apellidos[Math.floor(Math.random()*apellidos.length)];
}

// Genera RFC aleatorio
export function randomRFC(tipo){
    const letras="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rfc="";

    // Personas físicas = 4 letras, morales = 3
    if(tipo==='fisica'){
        for(let i=0;i<4;i++) rfc+=letras[Math.floor(Math.random()*letras.length)];
    } else {
        for(let i=0;i<3;i++) rfc+=letras[Math.floor(Math.random()*letras.length)];
    }

    // Fecha simulada
    rfc += String(Math.floor(Math.random()*1000000)).padStart(6,'0');

    // Homoclave
    for(let i=0;i<3;i++){
        rfc += letras[Math.floor(Math.random()*letras.length)];
    }

    return rfc;
}