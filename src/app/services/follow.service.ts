import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addFollow(token, follow):Observable<any>{
		let params = JSON.stringify(follow);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'follow', params, {headers:headers});
	}

	deleteFollow(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'follow/'+id, {headers:headers});
	}

	usuariosQueSigo(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.get(this.url+'following/'+id, {headers:headers});
	}

	usuariosMeSiguen(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'followed/'+id, {headers:headers});
	}


	sumarSeguidor(token,id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.get(this.url+'sumar-seguidor-usuario/'+id, {headers:headers});
	}

	restarSeguidor(token,id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.get(this.url+'restar-seguidor-usuario/'+id, {headers:headers});
	}

	
}