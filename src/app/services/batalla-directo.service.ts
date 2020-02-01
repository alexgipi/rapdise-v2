import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { BatallaDirecto } from '../models/batalla-directo';

@Injectable()
export class BatallaDirectoService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	crearBatallaDirecto(token, batallaDirecto):Observable<any>{
		let params = JSON.stringify(batallaDirecto);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'crear-batalla-directo', params,  {headers:headers});
    }

    getBatallasDirecto():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-batallas-directo', {headers:headers});
    }

    getBatallasDirectoPorEstado(estado):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+ 'get-batallas-directo/'+estado, {headers:headers});
	}
    
	getBatallaDirecto(nickUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+ 'get-batalla-directo/'+nickUsuario, {headers:headers});
    }


    editarBatallaDirecto(token,batallaDirecto:BatallaDirecto): Observable<any>{
		let params = JSON.stringify(batallaDirecto);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

	   	return this._http.put(this.url+'editar-batalla-directo/' + batallaDirecto._id, params, {headers:headers});
    }
    
    eliminarBatallaDirecto(token, idBatallaDirecto):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.delete(this.url+'eliminar-batalla-directo/' + idBatallaDirecto,  {headers:headers});
	}

	
}