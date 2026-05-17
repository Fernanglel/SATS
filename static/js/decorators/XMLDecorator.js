// Decorador para generar archivo XML

import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarXML } from '../utils/descargas.js';

export class XMLDecorator extends FacturaDecorador {
    generar(){
        // Genera y descarga el XML
        descargarXML();

        // Continúa con la cadena
        return super.generar();
    }
}