import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { BatallaDirecto } from '../models/batalla-directo';

@Injectable()
export class BatallaStreamingService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	crearBatallaStreaming(token, batallaStreaming):Observable<any>{
		let params = JSON.stringify(batallaStreaming);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'crear-batalla-streaming', params,  {headers:headers});
	}


	buscarRivalStreaming(token):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.get(this.url+'buscar-rival-streaming',  {headers:headers});
	}
	




  getBatallasDirecto():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-batallas-directo', {headers:headers});
  }
    
	getBatallaDirecto(nickUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+ 'get-batalla-directo/'+nickUsuario, {headers:headers});
	}  

	
}