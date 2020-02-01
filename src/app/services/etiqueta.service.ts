import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';


@Injectable()
export class EtiquetaService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addEtiqueta(token, etiqueta):Observable<any>{
		let params = JSON.stringify(etiqueta);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'add-etiqueta', params, {headers:headers});
	}
	
	addEtiquetas(token, etiquetas):Observable<any>{
		let params = JSON.stringify(etiquetas)
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'add-etiquetas', params, {headers:headers});
    }
    
    quitarEtiqueta(token, etiqueta):Observable<any>{
		let params = JSON.stringify(etiqueta);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'quitar-etiqueta', params, {headers:headers});
	}

    getEtiquetas(tipo = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if(tipo != null){
            
            return this._http.get(this.url+'get-etiquetas/'+tipo, {headers:headers});

        } else {
            return this._http.get(this.url+'get-etiquetas', {headers:headers});
        }
		
	}
	
	getEtiqueta(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');


        return this._http.get(this.url+'get-etiqueta/'+id, {headers:headers});
  
		
    }
}