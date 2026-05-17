import { PendienteState } from './PendienteState.js';

export class FacturaState {

    constructor() {

        this.estado =
            new PendienteState();
    }

    setEstado(estado) {

        this.estado = estado;
    }

    obtenerEstado() {

        return this.estado.obtenerEstado();
    }

    siguiente() {

        if(this.estado.siguiente){
            this.estado.siguiente(this);
        }
    }

    pagar() {

        if(this.estado.pagar){
            this.estado.pagar(this);
        }
    }

    cancelar() {

        if(this.estado.cancelar){
            this.estado.cancelar(this);
        }
    }
}