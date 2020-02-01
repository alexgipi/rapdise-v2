import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Voto } from '../models/voto';

@Injectable()
export class VotoService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	guardarVoto(token, voto):Observable<any>{
		let params = JSON.stringify(voto);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'guardar-voto', params, {headers:headers});
    }
    
    getVoto(idVoto):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+ 'beat/'+idVoto, {headers:headers});
    }

    getVotoIdentityBatalla(token, idBatalla):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

		return this._http.get(this.url+ 'get-voto-identity-batalla/'+idBatalla, {headers:headers});
    }

	getVotos():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-votos', {headers:headers});
    }

    getVotosBatalla(idBatalla):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-votos-batalla/'+idBatalla, {headers:headers});
    }

    getVotosUsuarioBatalla(idUsuario,idBatalla):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-votos-usuario-batalla/'+idUsuario+"/"+idBatalla, {headers:headers});
    }
    
    editarVoto(token, voto:Voto):Observable<any>{
		let params = JSON.stringify(voto);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-voto/'+ voto._id, params,  {headers:headers});
	}
	
}