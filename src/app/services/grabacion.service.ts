import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Grabacion } from '../models/grabacion';

@Injectable()
export class GrabacionService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addGrabacion(token, grabacion):Observable<any>{
		let params = JSON.stringify(grabacion);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'grabacion', params,  {headers:headers});
	}

	getGrabacion(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get(this.url+ 'grabacion/'+id, {headers:headers});
	}

	editarGrabacion(token, id, grabacion):Observable<any>{
		let params = JSON.stringify(grabacion);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-grabacion/'+ id, params,  {headers:headers});
	}

	borrarGrabacion(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.delete(this.url+'borrar-grabacion/' + id,  {headers:headers});
	}

	getGrabaciones():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'grabaciones', {headers:headers});
	}

	getNumGrabacionesUsuarioConMismosParametros(token,modo,tiempoCambio = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		if(tiempoCambio == null) {
			return this._http.get(this.url+'numero-grabaciones-con-mismos-parametros/'+modo, {headers:headers});
		} else {
			return this._http.get(this.url+'numero-grabaciones-con-mismos-parametros/'+modo+'/'+tiempoCambio, {headers:headers});
		}

		
	}

	getGrabacionesTipoFreestyle():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'grabaciones-tipo-freestyle', {headers:headers});
	}

	getGrabacionesTipoTema():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'grabaciones-tipo-tema', {headers:headers});
	}


	getGrabacionesUsuario(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'grabaciones-usuario/' + nick, {headers:headers});
	}

	getIdsGrabacionesLikeUsuario(idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'ids-freestyles-like-usuario/' + idUsuario, {headers:headers});
	}

	guardarAudioGrabacion(token, audioGrabacion):Observable<any>{
		let params = JSON.stringify(audioGrabacion);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

		return this._http.post(this.url+ 'guardar-audio-grabacion',params, {headers:headers});
	}

	guardarMiniaturaGrabacion(token, miniaturaGrabacion):Observable<any>{
		let params = JSON.stringify(miniaturaGrabacion);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

		return this._http.post(this.url+ 'guardar-miniatura-grabacion',params, {headers:headers});
	}

	
}