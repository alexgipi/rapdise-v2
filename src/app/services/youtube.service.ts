import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Voto } from '../models/voto';

@Injectable()
export class YoutubeService {
	public url:string;
	public identity;
	public token;
    public stats;
    public claveAPI:string;

	constructor(private _http: HttpClient){
        this.claveAPI = 'AIzaSyAXrBT7473iLTCbnv2PoVULmlpE3XBbFcA';
		this.url = 'https://www.googleapis.com/youtube/v3/';
	}

    getInfoUsuarioPorNicK(nickUsuario):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let urlInfoUsuario = this.url+'channels?part=snippet,contentDetails&forUsername='+nickUsuario+'&key='+this.claveAPI;

		return this._http.get(urlInfoUsuario, {headers:headers});
    }

    getVideosSubidosUsuario(idListaVideosSubidos):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let urlVideosSubidosUsuario = this.url+'playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId='+idListaVideosSubidos+'&key='+this.claveAPI;

		return this._http.get(urlVideosSubidosUsuario, {headers:headers});
    }

    getVideo(idVideo):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let urlgetVideo = this.url+'videos?part=snippet,contentDetails,status,statistics&maxResults=10&id='+idVideo+'&key='+this.claveAPI;

		return this._http.get(urlgetVideo, {headers:headers});
    }

    

    
    
	
}