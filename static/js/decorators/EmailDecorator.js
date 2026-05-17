// Decorador para enviar la factura por correo

import { FacturaDecorador } from './FacturaDecorador.js';
import { enviarEmail } from '../utils/descargas.js';

export class EmailDecorator extends FacturaDecorador {
    generar(){
        // Abre cliente de correo con la información de la factura
        enviarEmail();

        return super.generar();
    }
}