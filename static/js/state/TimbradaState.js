import { EstadoFactura } from './EstadoFactura.js';
import { PagadaState } from './PagadaState.js';
import { CanceladaState } from './CanceladaState.js';

export class TimbradaState extends EstadoFactura {

    pagar(factura) {

        factura.setEstado(
            new PagadaState()
        );
    }

    cancelar(factura) {

        factura.setEstado(
            new CanceladaState()
        );
    }

    obtenerEstado() {
        return "Timbrada";
    }
}