import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarPDF } from '../utils/descargas.js';

export class PDFDecorator extends FacturaDecorador {

    generar(){

        console.log("PDF EJECUTADO");

        descargarPDF();

        return super.generar();
    }

}