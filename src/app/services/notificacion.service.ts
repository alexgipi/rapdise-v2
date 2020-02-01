import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { NotificacionBatalla } from '../models/notificacion-batalla';

@Injectable()
export class NotificacionService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	guardarNotificacionBatalla(token,batalla,usuario,textoNotificacion):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.get(this.url+'guardar-notificacion-batalla/'+batalla+"/"+usuario+"/"+textoNotificacion,  {headers:headers});
	}

	getNotificacionesBatallaUsuario(token,id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization',token);
		return this._http.get(this.url+ 'notificaciones-batalla-usuario/'+id, {headers:headers});
    }
    
    
    eliminarNotificacionBatalla(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.delete(this.url+ 'eliminar-notificacion-batalla/'+id, {headers:headers});
    }
	
	
}