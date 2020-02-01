import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService {
	public url:string;
	public identity;
	public token;
	public stats;
	public page;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addPublication(token, publication):Observable<any>{
		let params = JSON.stringify(publication);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'publication', params,  {headers:headers});
	}

	getPublicationsPaginado(token, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.get(this.url+'publications-paginado/' + page, {headers:headers});
	}

	getPublications(token):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.get(this.url+'publications', {headers:headers});
	}

	getPublicationsUsuario(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get(this.url+'publications-usuario/' + nick, {headers:headers});
	}

	deletePublication(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.delete(this.url+'publication/' + id,  {headers:headers});
	}

	
}