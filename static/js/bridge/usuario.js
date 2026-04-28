// ==================== IMPORTS ====================
// Importamos funciones que generan datos aleatorios
import { randomRFC, randomNombre } from '../utils/generadores.js';

// ==================== CLASE BASE ====================
// Clase abstracta (base)
export class Usuario {
    generarFactura(){
        return {}; // método que se sobrescribe
    }
}

// ==================== PERSONA FISICA ====================
export class UsuarioFisica extends Usuario {

    // Genera datos de una persona física
    generarFactura() { 
        return { 
            rfc: randomRFC('fisica'),  // RFC tipo persona física
            nombre: randomNombre('fisica') // Nombre de persona
        }; 
    }
}

// ==================== PERSONA MORAL ====================
export class UsuarioMoral extends Usuario {

    // Genera datos de empresa
    generarFactura() { 
        return { 
            rfc: randomRFC('moral'), // RFC empresa
            nombre: randomNombre('empresa') // Nombre empresa
        }; 
    }
}

