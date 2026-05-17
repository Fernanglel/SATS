// Decorador para generar archivo TXT

import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarTXT } from '../utils/descargas.js';

export class TXTDecorator extends FacturaDecorador {
    generar(){
        // Genera archivo de texto plano
        descargarTXT();

        return super.generar();
    }
}