import { EstadoFactura } from './EstadoFactura.js';

export class PagadaState extends EstadoFactura {

    obtenerEstado() {
        return "Pagada";
    }
}