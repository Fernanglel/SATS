// ==================== IMPORTS ====================
import {
    randomRFC,
    randomNombre
}
from '../utils/generadores.js';

// ==================== CLASE BASE ====================
export class Usuario {

    generarFactura() {
        return {};
    }
}

// ==================== PERSONA FISICA ====================
export class UsuarioFisica extends Usuario {

    generarFactura() {

        return {

            rfc: randomRFC('fisica'),

            nombre: randomNombre('fisica')
        };
    }

    obtenerOpciones() {

        return [
            "Ingreso",
            "Egreso"
        ];
    }
}

// ==================== PERSONA MORAL ====================
export class UsuarioMoral extends Usuario {

    generarFactura() {

        return {

            rfc: randomRFC('moral'),

            nombre: randomNombre('empresa')
        };
    }

    obtenerOpciones() {

        return [
            "Ingreso",
            "Egreso",
            "Nómina",
            "Empresarial"
        ];
    }
}