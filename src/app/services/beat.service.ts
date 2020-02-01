import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Beat } from '../models/beat';

@Injectable()
export class BeatService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	getBeat(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+ 'beat/'+id, {headers:headers});
	}

	addBeat(token, beat):Observable<any>{
		let params = JSON.stringify(beat);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'beat', params,  {headers:headers});
	}

	editarBeat(token, id, beat):Observable<any>{
		let params = JSON.stringify(beat);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-beat/'+ id, params,  {headers:headers});
	}


	guardarImagenBeat(token, imagenBeat):Observable<any>{
		let params = JSON.stringify(imagenBeat);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

		return this._http.post(this.url+ 'guardar-imagen-beat',params, {headers:headers});
	}

	sumarReproduccionBeat(token, id, beat):Observable<any>{
		let params = JSON.stringify(beat);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'sumar-reproduccion-beat/'+ id, params,  {headers:headers});
	}

	getBeats(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'beats/'+id, {headers:headers});
	}

	sumarLikeBeat(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.put(this.url+'sumar-like-beat/'+id, {headers:headers});
	}

	restarLikeBeat(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.put(this.url+'restar-like-beat/'+id, {headers:headers});
	}

	getBeatsEstilo(style,id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'beats-por-estilo/' + style + "/" +id, {headers:headers});
	}

	getBeatsUsuario(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'beats-usuario/' + nick, {headers:headers});
	}

	getBeatsUsuarioEstilo(nick, style):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'beats-por-usuario-y-estilo/' + nick + "/" + style, {headers:headers});
	}

	getBeatsBusqueda(textoBusqueda): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

	   	return this._http.get(this.url+'get-beats-busqueda/'+textoBusqueda, {headers:headers});
	}

	descargarBeat(file){
		let headers = new HttpHeaders().set('Content-Type', 'application/json')


		return this._http.get(this.url+'get-audio-beat/' + file, {responseType : 'blob', headers:headers});
	}
	
}