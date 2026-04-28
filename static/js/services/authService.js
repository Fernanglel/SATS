// ==================== SERVICIO DE LOGIN ====================

// Importamos funciones de validación
import { esRFCValido, obtenerTipoUsuario, passwordValido } from '../utils/validaciones.js';

// Función principal del login
export function loginUsuario(rfc, password){

    // Validar RFC
    if(!esRFCValido(rfc)){
        return {
            ok: false,
            mensaje: "RFC inválido."
        };
    }

    // Validar contraseña
    if(!passwordValido(password)){
        return {
            ok: false,
            mensaje: "Debes ingresar una contraseña"
        };
    }

    // Determinar tipo de usuario (Bridge)
    const tipoUsuario = obtenerTipoUsuario(rfc);

    // Guardar en localStorage
    localStorage.setItem("tipoUsuario", tipoUsuario);

    // Login correcto
    return {
        ok: true
    };
}