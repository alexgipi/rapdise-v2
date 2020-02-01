import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { FavoritoBeat } from '../models/favorito-beat';

@Injectable()
export class FavoritoService {
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	addFavoritoBeat(token, favorito):Observable<any>{
		let params = JSON.stringify(favorito);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'favorito-beat', params, {headers:headers});
	}

	deleteFavoritoBeat(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.delete(this.url+'favorito-beat/'+id, {headers:headers});
    }

    getMisBeatsFavoritos(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url+'mis-beats-favoritos', {headers:headers});
    }

    getBeatsFavoritosUsuario(idUsuario):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'beats-favoritos-usuario/'+idUsuario, {headers:headers});
    }
	
}