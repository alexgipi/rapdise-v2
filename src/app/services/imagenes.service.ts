import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ImagenesService {
	public url:string;
	public imagenes;

	constructor(public _http: HttpClient){

	}

	// getImagenes():Observable<any>{
	// 	let headers = new HttpHeaders().set('Content-Type', 'application/json')

	// 	return this.imagenes;
	// }

	getImagenes():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this._http.get('https://pixabay.com/api/?key=10715797-24664775d89d6839a3c599cb5&image_type=photo&per_page=200&page=1');
	}
	

	getImagenesPorBusqueda(busqueda,pagina = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get('https://pixabay.com/api/?key=10715797-24664775d89d6839a3c599cb5&image_type=photo&per_page=200&q='+encodeURIComponent(busqueda)+"&page="+pagina, {headers:headers});
	}

	getImagenesPorCategoria(categoria,pagina = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.get('https://pixabay.com/api/?key=10715797-24664775d89d6839a3c599cb5&image_type=photo&per_page=200&category='+encodeURIComponent(categoria)+"&page="+pagina, {headers:headers});
	}
	
}