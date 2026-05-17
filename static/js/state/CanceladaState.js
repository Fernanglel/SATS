import { EstadoFactura } from './EstadoFactura.js';

export class CanceladaState extends EstadoFactura {

    obtenerEstado() {
        return "Cancelada";
    }
}