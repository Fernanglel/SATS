import {
    UsuarioFisica,
    UsuarioMoral
}
from '../models/usuario.js';

export class UsuarioFactory {

    static crearUsuario(tipoUsuario) {

        if(tipoUsuario === "fisica"){
            return new UsuarioFisica();
        }

        if(tipoUsuario === "moral"){
            return new UsuarioMoral();
        }

        throw new Error("Tipo inválido");
    }
}