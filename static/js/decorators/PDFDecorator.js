// Decorador para generar descarga en PDF

import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarPDF } from '../utils/descargas.js';

export class PDFDecorator extends FacturaDecorador {
    generar(){
        // Acción adicional: generar PDF
        descargarPDF();

        // Llamamos al método base para mantener la cadena de decoradores
        return super.generar();
    }
}