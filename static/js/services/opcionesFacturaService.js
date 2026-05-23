// ==================== OPCIONES SEGUN USUARIO ====================

export function obtenerOpcionesFactura() {

    // Obtener tipo guardado
    const tipoUsuario =
        localStorage.getItem("tipoUsuario");

    console.log("TIPO:", tipoUsuario);

    // PERSONA FISICA
    if(tipoUsuario === "fisica") {

        return [

            "Ingreso",

            "Egreso"
        ];
    }

    // PERSONA MORAL
    return [

        "Ingreso",

        "Egreso",

        "Nomina",

        "Empresarial",


    ];
}