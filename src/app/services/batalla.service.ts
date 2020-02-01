import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Batalla } from '../models/batalla';

@Injectable()
export class BatallaService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

	guardarBatalla(token, batalla):Observable<any>{
		let params = JSON.stringify(batalla);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.post(this.url+'guardar-batalla', params,  {headers:headers});
	}

	addBatallaDesafiar(token,nombre,modo,rondas,duracion,intentosRonda,palabrasRonda1,base1,impro1,usuario2):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.get(this.url+'guardar-batalla/'+nombre+"/"+modo+"/"+rondas+"/"+duracion+"/"+intentosRonda+"/"+palabrasRonda1+"/"+base1+"/"+impro1+"/"+usuario2,  {headers:headers});
	}

	addBatallaBuscarRival(token,nombre,modo,rondas,duracion,intentosRonda,palabrasImpro1,base1,impro1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);
		
		return this._http.get(this.url+'guardar-batalla/'+nombre+"/"+modo+"/"+rondas+"/"+duracion+"/"+intentosRonda+"/"+palabrasImpro1+"/"+base1+"/"+impro1,  {headers:headers});
	}

	guardarAudioBatalla(token, audioBatalla):Observable<any>{
		let params = JSON.stringify(audioBatalla);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

		return this._http.post(this.url+ 'guardar-audio-batalla',params, {headers:headers});
	}

	getBatalla(idBatalla,idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+ 'batalla/'+idBatalla+"/"+idUsuario, {headers:headers});
	}

	getBatallas(idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'batallas/'+idUsuario, {headers:headers});
	}

	sumarLikeBatalla(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.put(this.url+'sumar-like-batalla/'+id, {headers:headers});
	}

	restarLikeBatalla(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.put(this.url+'restar-like-batalla/'+id, {headers:headers});
	}

	sumarVisualizacionBatalla(idBatalla):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.put(this.url+'sumar-visualizacion-batalla/'+idBatalla, {headers:headers});
	}

	getBatallasUsuario(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'batallas-usuario/'+id, {headers:headers});
	}

	getBatallasEstado(estado,idUsuario):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'batallas-estado/'+estado+'/'+idUsuario, {headers:headers});
	}

	getBatallasEstadoUsuario(estado,id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'batallas-estado-usuario/'+estado+"/"+id, {headers:headers});
	}

	getSolicitudesBatallaUsuario(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'solicitudes-batallas-usuario/'+id, {headers:headers});
	}

	getBatallasBuscandoRival():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get(this.url+'batallas-buscando-rival', {headers:headers});
	}

	modificarEstadoYNombre(id,estado,nombre){
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'/modificar-estado-y-nombre-batalla/'+id+"/"+estado+"/"+nombre, {headers:headers});

	}

	modificarUsuario2(id,usuario2){
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'/modificar-usuario2-batalla/'+id+"/"+usuario2, {headers:headers});
	}

	modificarGanadorBatalla(id,ganador){
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'/modificar-ganador-batalla/'+id+"/"+ganador, {headers:headers});
	}

	modificarBatalla(token,batalla:Batalla): Observable<any>{
		let params = JSON.stringify(batalla);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
										.set('Authorization',token);

	   	return this._http.put(this.url+'modificar-batalla/'+batalla._id, params, {headers:headers});
	}

	getVisualizacionesBatalla(idBatalla): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

	   	return this._http.get(this.url+'get-visualizaciones-batalla/'+idBatalla, {headers:headers});
	}

	getBatallasBusqueda(textoBusqueda): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

	   	return this._http.get(this.url+'get-batallas-busqueda/'+textoBusqueda, {headers:headers});
	}
	
	
}