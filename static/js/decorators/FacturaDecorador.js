// Clase decoradora base
// Sirve como plantilla para todos los decoradores concretos

import { Factura } from './Factura.js';

export class FacturaDecorador extends Factura {
    constructor(factura){
        // Heredamos los datos de la factura original
        super(factura.datos);

        // Guardamos referencia a la factura que estamos decorando
        this.factura = factura;
    }

    generar(){
        // Delegamos la ejecución al objeto original
        // (esto permite encadenar múltiples decoradores)
        return this.factura.generar();
    }
}