import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { LikeBeat } from '../../../models/like-beat';
import { FavoritoBeat } from '../../../models/favorito-beat';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { LikeBeatService } from '../../../services/like-beat.service';
import { FavoritoService } from '../../../services/favorito.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'listado-beats-favoritos',
  templateUrl: './listado-beats-favoritos.component.html',
  providers: [UserService, BeatService, LikeBeatService, FavoritoService]
})

export class ListadoBeatsFavoritosComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	public beats: Beat[];

	public beatsFavoritos: FavoritoBeat[];
	public total;
	public textoEstilo: string;

	public likes;
	public totalLikes;

	public favoritos;
	public totalFavoritos;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _likeBeatService: LikeBeatService,
		private _favoritoService: FavoritoService

	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}
	ngOnInit(){
		console.log('Componente de beats por estilo cargado!');
		this.loadPage();
		this.getBeatsFavoritos(this.identity._id);
	}

	loadPage(){
		this._route.params.subscribe(params => {
			this.titulo = 'Mis beats favoritos';
		});
	}

	getBeatsFavoritos(id){
		this._favoritoService.getBeatsFavoritosUsuario(id).subscribe(
			response => {
				if(response.favoritos){
					this.beatsFavoritos = response.favoritos;
					this.total = response.total;
					
					this.likes = response.beats_me_gustan;
					this.totalLikes = this.likes.length;

					this.favoritos = response.beats_favoritos;
					this.totalFavoritos = this.favoritos.length;

					console.log(this.beatsFavoritos);
					console.log(this.total);

					console.log(this.likes);
					console.log(this.totalLikes);

					console.log(this.favoritos);
					console.log(this.totalFavoritos);
					
				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	public likeBeatOver;
	mouseEnter(beat_id){
		this.likeBeatOver = beat_id;
	}

	mouseLeave(beat_id){
		this.likeBeatOver = 0;
	}

	public favoritoBeatOver;
	mouseEnterFavorito(beat_id){
		this.favoritoBeatOver = beat_id;
	}

	mouseLeaveFavorito(beat_id){
		this.favoritoBeatOver = 0;
	}

	likeBeat(beat){
		var like = new LikeBeat('', this.identity._id, beat, '');

		this._likeBeatService.addLikeBeat(this.token, like).subscribe(
			response => {
				if(!response.like){
					this.status = 'error';
				}else {
					this.status = 'success';
					this.likes.push(beat);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	borrarLikeBeat(beat){

		this._likeBeatService.deleteLikeBeat(this.token, beat).subscribe(
			response => {
				var search = this.likes.indexOf(beat);
				if(search != -1){
					this.likes.splice(search,	1);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	sumarLikeBeat(beat_id) {
		console.log(beat_id);

		this._beatService.sumarLikeBeat(beat_id).subscribe(
			response => {
				if(!response.beat){
					this.status = 'error';
				}else {
					console.log(response.beat);
					this.status = 'success';
					this.refresh();
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}

		);
	}

	restarLikeBeat(beat_id) {
		console.log(beat_id);

		this._beatService.restarLikeBeat(beat_id).subscribe(
			response => {
				if(!response.beat){
					this.status = 'error';
				}else {
					console.log(response.beat);
					this.status = 'success';
					this.refresh();
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}

		);
	}

	favoritoBeat(beat){
		var favorito = new FavoritoBeat('', this.identity._id, beat, '');

		this._favoritoService.addFavoritoBeat(this.token, favorito).subscribe(
			response => {
				if(!response.favorito){
					this.status = 'error';
				}else {
					this.status = 'success';
					this.favoritos.push(beat);
					this.refresh();
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	borrarFavoritoBeat(beat){

		this._favoritoService.deleteFavoritoBeat(this.token, beat).subscribe(
			response => {
				var search = this.favoritos.indexOf(beat);
				if(search != -1){
					this.favoritos.splice(search,	1);
					this.refresh();
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	refresh(event = null){
		this.getBeatsFavoritos(this.identity._id);
	}

	refreshNumFavoritos(event = null){
		this.getBeatsFavoritos(this.identity._id);
	}
}
