// Decorador para generar descarga en PDF

import { FacturaDecorador } from './FacturaDecorador.js';
import { descargarPDF } from '../utils/descargas.js';

export class PDFDecorator extends FacturaDecorador {
   generar(){

const factura=

document.getElementById(
"facturaPDF"
);

html2pdf()

.set({

margin:10,

filename:
"Factura.pdf",

html2canvas:{

scale:2
},

jsPDF:{

unit:"mm",

format:"a4",

orientation:
"portrait"
}

})

.from(
factura
)

.save();

}
}