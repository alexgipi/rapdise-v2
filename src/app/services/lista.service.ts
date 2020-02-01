import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Lista } from '../models/lista';

@Injectable()
export class ListaService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	crearLista(token, lista):Observable<any>{
		let params = JSON.stringify(lista);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'crear-lista', params,  {headers:headers});
	}

	getLista(idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get(this.url+ 'lista/'+idLista, {headers:headers});
	}

	editarLista(token, idLista, lista):Observable<any>{
		let params = JSON.stringify(lista);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-lista/'+ idLista, params,  {headers:headers});
	}

	borrarLista(token, idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.delete(this.url+'borrar-lista/' + idLista,  {headers:headers});
	}

	getListas():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'listas', {headers:headers});
	}

	getListasUsuario(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'listas-usuario/' + nick, {headers:headers});
    }
    
    incluirBeatEnLista(idBeat,idLista):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'/incluir-beat-en-lista/'+idBeat+'/'+idLista, {headers:headers});

    }

    borrarBeatDeLista(idLista,idBeat):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'/borrar-beat-de-lista/'+idLista+'/'+idBeat, {headers:headers});

    }

    moverBeatDeLista():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'/', {headers:headers});

	}
	
	comprobarBeatEnLista(idBeat,idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + '/comprobar-beat-en-lista/'+idBeat+'/'+idLista, {headers:headers});
	}

    subirImagenLista():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'/', {headers:headers});

    }

	// guardarAudioGrabacion(token, audioGrabacion):Observable<any>{
	// 	let params = JSON.stringify(audioGrabacion);
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json')
	// 									.set('Authorization',token);

	// 	return this._http.post(this.url+ 'guardar-audio-grabacion',params, {headers:headers});
	// }

	
}