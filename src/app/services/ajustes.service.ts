import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Lista } from '../models/lista';

@Injectable()
export class AjustesService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	guardarAjustesChatPublico(token, ajustes):Observable<any>{
		let params = JSON.stringify(ajustes);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'guardar-ajustes-chat-publico', params,  {headers:headers});
	}

	getAjustesChatPublicoUsuario(idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get(this.url+ 'get-ajustes-chat-publico/'+idUsuario, {headers:headers});
	}

	editarAjustesChatPublico(token, ajustes):Observable<any>{
		let params = JSON.stringify(ajustes);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-ajustes-chat-publico-usuario', params,  {headers:headers});
	}

	
}