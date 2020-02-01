import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class DestacadoService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	guardarDestacado(token, destacado):Observable<any>{
		let params = JSON.stringify(destacado);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'guardar-destacado', params, {headers:headers});
	}

    getDestacados(tipo = null, usuarioDestacadoEn = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if(tipo != null){
            if(tipo == 'usuario' && usuarioDestacadoEn != null) { 
            
                return this._http.get(this.url+'get-destacados/'+tipo+'/'+usuarioDestacadoEn, {headers:headers});
                
            } else {
                return this._http.get(this.url+'get-destacados/'+tipo, {headers:headers});
            }
        } else {
            return this._http.get(this.url+'get-destacados', {headers:headers});
        }
		
    }

    getDestacado(idDestacado):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'get-destacado/'+idDestacado, {headers:headers});
    }

    eliminarDestacado(token, tipo,idContenidoDestacado, usuarioDestacadoEn = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
                                       
        if(usuarioDestacadoEn != null){
            return this._http.delete(this.url+'eliminar-destacado/'+tipo+'/'+idContenidoDestacado+'/'+usuarioDestacadoEn, {headers:headers});
        } else {
            return this._http.delete(this.url+'eliminar-destacado/'+tipo+'/'+idContenidoDestacado, {headers:headers});
        }
		
    }

    comprobarSiEsDestacado(tipo,idContenidoDestacado, usuarioDestacadoEn = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if(usuarioDestacadoEn != null){
            return this._http.get(this.url+'comprobar-si-es-destacado/'+tipo+'/'+idContenidoDestacado+'/'+usuarioDestacadoEn, {headers:headers});
        } else {
            return this._http.get(this.url+'comprobar-si-es-destacado/'+tipo+'/'+idContenidoDestacado, {headers:headers});
        }
    }
}