import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { LikeBeat } from '../models/like-beat';

@Injectable()
export class LikeBeatService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addLikeBeat(token, like):Observable<any>{
		let params = JSON.stringify(like);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'like-beat', params, {headers:headers});
	}

	deleteLikeBeat(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'like-beat/'+id, {headers:headers});
    }

    getBeatsMeGustan(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url+'beats-me-gustan', {headers:headers});
    }

    getBeatsLikeUsuario(idUsuario):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'beats-like-usuario/'+idUsuario, {headers:headers});
    }

    getContadorLikesBeat(idBeat):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'contador-likes-beat/'+idBeat, {headers:headers});
    }
	
}