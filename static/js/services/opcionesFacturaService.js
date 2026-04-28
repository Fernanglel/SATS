// ==================== SERVICIO DE OPCIONES ====================

// Esta función determina qué tipos de factura mostrar
// dependiendo del tipo de usuario (Bridge)
export function obtenerOpcionesFactura() {

    // Obtenemos el tipo de usuario desde localStorage
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // Opciones disponibles para persona física
    const opcionesFisica = ['Ingreso', 'Egreso'];

    // Opciones disponibles para persona moral
    const opcionesMoral = ['Nómina', 'Ingreso', 'Traslado'];

    // Retornamos la lista según el tipo de usuario
    return tipoUsuario === 'fisica'
        ? opcionesFisica
        : opcionesMoral;
}