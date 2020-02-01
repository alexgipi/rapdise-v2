import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { LikePublication } from '../models/like-publication';

@Injectable()
export class LikePublicationService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addLikePublicacion(token, like):Observable<any>{
		let params = JSON.stringify(like);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'like-publicacion', params, {headers:headers});
	}

	deleteLikePublicacion(token, idPublicacion):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'like-publicacion/'+idPublicacion, {headers:headers});
    }

    getPublicacionesMeGustan(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url+'publicaciones-me-gustan', {headers:headers});
    }

    getPublicacionesLikeUsuario(idUsuario):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'publicaciones-like-usuario/'+idUsuario, {headers:headers});
    }

    getContadorLikesPublicacion(idPublicacion):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'contador-likes-publicacion/'+idPublicacion, {headers:headers});
    }
	
}