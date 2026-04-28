// ==================== VALIDACIONES ====================

// Expresión regular para RFC de persona física
// 4 letras + 6 números (fecha) + 3 caracteres alfanuméricos
const regexFisica = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;

// Expresión regular para RFC de persona moral
// 3 letras + 6 números (fecha) + 3 caracteres alfanuméricos
const regexMoral = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;

// Función que valida si el RFC cumple con alguno de los formatos
export function esRFCValido(rfc){
    return regexFisica.test(rfc) || regexMoral.test(rfc);
}

// Determina si el RFC pertenece a persona física o moral
export function obtenerTipoUsuario(rfc){

    // Si cumple con el patrón de moral → es empresa
    if(regexMoral.test(rfc)){
        return 'moral';
    }

    // Si no, se asume persona física
    return 'fisica';
}

// Verifica que la contraseña no esté vacía
export function passwordValido(password){

    // trim elimina espacios en blanco
    return password.trim().length > 0;
}