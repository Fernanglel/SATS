import { EstadoFactura } from './EstadoFactura.js';
import { TimbradaState } from './TimbradaState.js';

export class PendienteState extends EstadoFactura {

    siguiente(factura) {

        factura.setEstado(
            new TimbradaState()
        );
    }

    obtenerEstado() {
        return "Pendiente";
    }
}