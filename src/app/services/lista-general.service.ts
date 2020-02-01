import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ListaGeneralService {
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
		
		return this._http.post(this.url+'crear-lista-general', params,  {headers:headers});
	}

	crearListasFavoritosUsuario(token):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.get(this.url+'crear-listas-favoritos-usuario',  {headers:headers});
	}

	getLista(idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get(this.url+ 'lista-general/'+idLista, {headers:headers});
	}

	

	getListas():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'listas-generales', {headers:headers});
	}

	getListasUsuario(nick):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'listas-generales-usuario/'+nick, {headers:headers});
	}
	
	getListasUsuarioTipo(nick,tipo):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'listas-generales-usuario-tipo/'+nick+'/'+tipo, {headers:headers});
    }
    
    incluirPubEnLista(tipoPub,idPub,idLista):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'/incluir-pub-en-lista-general/'+tipoPub+'/'+idPub+'/'+idLista, {headers:headers});

	}
	
	comprobarPubEnLista(tipoPub,idPub,idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + '/comprobar-pub-en-lista-general/'+tipoPub+'/'+idPub+'/'+idLista, {headers:headers});
	}

    borrarPubDeLista(tipoPub,idLista,idPub):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'/borrar-pub-de-lista-general/'+tipoPub+'/'+idLista+'/'+idPub, {headers:headers});

	}


	editarLista(token, idLista, lista):Observable<any>{
		let params = JSON.stringify(lista);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.put(this.url+'editar-lista-general/'+ idLista, params,  {headers:headers});
	}

	borrarLista(token, idLista):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.delete(this.url+'borrar-lista-general/' + idLista,  {headers:headers});
	}


	moverBeatDeLista():Observable<any>{ // NO HACE NADA, falta implementar si es necesario
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'/', {headers:headers});

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