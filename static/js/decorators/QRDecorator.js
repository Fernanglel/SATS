// Decorador para generar código QR de la factura

import { FacturaDecorador } from './FacturaDecorador.js';
import { generarYDescargarQR } from '../utils/descargas.js';

export class QRDecorator extends FacturaDecorador {
    generar(){
        // Genera un QR con información de la factura
        generarYDescargarQR();

        return super.generar();
    }
}