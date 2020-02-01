import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
    public url;
    private urlSocket: string;
    private socket;    

    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
        this.urlSocket = GLOBAL.urlSocket;
        this.socket = io(this.urlSocket);
    }

    public getChatsPrivadosUsuario(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-chats-privados-usuario/'+id, {headers:headers});
	}

    public enviarMensaje(mensaje, emisor, receptor) {
        this.socket.emit('nuevo-mensaje', mensaje, emisor, receptor);
    }

    public abrirChat(idChat) {
        this.socket.emit('abrir-chat', idChat);
    }

    public getMensajes = () => {
        return Observable.create((observer) => {
            this.socket.on('mensajes', (mensajes) => {
                observer.next(mensajes);
            });
        });
    }
}