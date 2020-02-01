import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class ComunicacionComponentesService {

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    texto(texto) {    
        this.change.emit(texto);
    }
}