// Decorador para generar archivo JSON

import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarJSON } from '../utils/descargas.js';

export class JSONDecorator extends FacturaDecorador {
    generar(){
        // Descarga la factura en formato JSON
        descargarJSON();

        return super.generar();
    }
}