import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	register(user: User): Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'register', params, {headers:headers});
	}

	signup(user, gettoken = null): Observable<any>{
		if(gettoken != null){
			user.gettoken = gettoken;
		}

		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'login', params, {headers:headers});
	}

	loginEnRegistro(emailUser, gettoken = null): Observable<any>{
		if(gettoken != null){
			gettoken = "gettoken";
		}

		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		
		if(gettoken != null){
			return this._http.post(this.url+'login-en-registro/'+emailUser+"/"+gettoken, {headers:headers});
		} else {
			return this._http.post(this.url+'login-en-registro/'+emailUser, {headers:headers});
		}
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else {
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else {
			this.token = null;
		}

		return this.token;
	}

	getStats(){
		let stats = JSON.parse(localStorage.getItem('stats'));

		if(stats != "undefined"){
			this.stats = stats;
		}else {
			this.stats = null;
		}

		return this.stats;
	}

	getContadores(userId): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		if(userId){
			return this._http.get(this.url+'contadores/'+userId, {headers:headers});
		}
	}

	updateUser(user: User): Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', this.getToken());

	   	return this._http.put(this.url+'update-user/'+user._id, params, {headers:headers});
	}

	getUsersYSeguidores(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'users/'+id, {headers:headers});
	}

	getUsers():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'users', {headers:headers});
	}

	getMejoresUsuarios():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-mejores-usuarios', {headers:headers});
	}

	getProductoresYSeguidores(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'productores-beats/'+id, {headers:headers});
	}

	getProductores():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'productores-beats', {headers:headers});
	}

	getUser(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'user/'+nick, {headers:headers});
	}

	getUsersBusqueda(textoBusqueda):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'get-users-busqueda/'+textoBusqueda, {headers:headers});
	}

	contadorBeatsUsuario(idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'contador-beats-usuario/'+idUsuario, {headers:headers});
	}

	contadorReproduccionesBeatsUsuario(idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'contador-reproducciones-beats-usuario/'+idUsuario, {headers:headers});
	}
}