import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { LikeBatalla } from '../models/like-batalla';

@Injectable()
export class LikeBatallaService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addLikeBatalla(token, like):Observable<any>{
		let params = JSON.stringify(like);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'like-batalla', params, {headers:headers});
	}

	deleteLikeBatalla(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'like-batalla/'+id, {headers:headers});
    }

    getBatallasMeGustan(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url+'batallas-me-gustan', {headers:headers});
    }

    getBatallasLikeUsuario(idUsuario):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'batallas-like-usuario/'+idUsuario, {headers:headers});
    }

    getContadorLikesBatalla(idBatalla):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'contador-likes-batalla/'+idBatalla, {headers:headers});
    }
	
}