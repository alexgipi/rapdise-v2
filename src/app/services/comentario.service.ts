import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { ComentarioPub } from '../models/comentario-pub';
import { ComentarioBeat } from '../models/comentario-beat';

@Injectable()
export class ComentarioService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	comentarPublicacion(token, comentario):Observable<any>{
		let params = JSON.stringify(comentario);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'comentar-publicacion', params, {headers:headers});
	}
	eliminarComentarioPub(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'comentario-publicacion/'+id, {headers:headers});
    }
    editarComentarioPub(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.put(this.url+'editar-comentario-publicacion/'+id, {headers:headers});
    }
    getComentariosDePublicaciones():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'comentarios-publicaciones', {headers:headers});
    }
    getComentariosPublicacion(idPublicacion):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'comentarios-publicacion/'+idPublicacion, {headers:headers});
    }


    // COMENTARIOS DE (BEATS) ***********************************************

    comentarBeat(token, comentario):Observable<any>{
		let params = JSON.stringify(comentario);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'comentar-beat', params, {headers:headers});
	}
	eliminarComentarioBeat(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'comentario-beat/'+id, {headers:headers});
    }
    editarComentarioBeat(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.put(this.url+'editar-comentario-beat/'+id, {headers:headers});
    }
    getComentariosDeBeats():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'comentarios-beats', {headers:headers});
    }
    getComentariosBeat(idBeat){
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'comentarios-beat/'+idBeat, {headers:headers});
		}
		

	//COMENTARIOS DE BATALLAS ********************************************************
	comentarBatalla(token, comentario):Observable<any>{
		let params = JSON.stringify(comentario);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
											.set('Authorization', token);

		return this._http.post(this.url+'comentar-batalla', params, {headers:headers});
	}

	getComentariosDeBatallas():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'comentarios-batallas', {headers:headers});
	}

	getComentariosBatalla(idBatalla):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'comentarios-batalla/'+idBatalla, {headers:headers});
	}

	eliminarComentarioBatalla(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
											.set('Authorization', token);
		return this._http.delete(this.url+'comentario-batalla/'+id, {headers:headers});
	}

	editarComentarioBatalla(token, id):Observable<any>{
	let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization', token);
	return this._http.put(this.url+'editar-comentario-batalla/'+id, {headers:headers});
	}
}