import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../models/user';
import { Follow } from '../../../models/follow';
import { Beat } from '../../../models/beat';
import { FavoritoBeat } from '../../../models/favorito-beat';

import * as io from 'socket.io-client';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { FavoritoService } from '../../../services/favorito.service';
import { FollowService } from '../../../services/follow.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'beats-productores',
  templateUrl: './beats-productores.component.html',
  providers: [UserService, BeatService, FavoritoService, FollowService]
})

export class BeatsProductoresComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public estado: string;

	public productores: User[];
	public totalProductores;
	public follows;

	public primeProductor;
	public productorSeleccionado;
	public idProductor1;


	public beat;
	public sonando = false;


	// beats
	public beats: Beat[];
	public totalBeats;

	public primerBeat;
	public beatSeleccionado;
	public idBeat1;

	public filtroSeleccionado;

	public socket: SocketIOClient.Socket;
	public urlSocket;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _favoritoService: FavoritoService,
		private _followService: FollowService

	){
		this.titulo = 'Productores de beats';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);
	}
	ngOnInit(){
		console.log('Componente de beats cargado!');
		// this.contadorLikesBeat("5b205e128d6a5b24e0bff157");
		this.getProductoresBeats();

		$(".footer").addClass("display-none");

		
		var that = this;

		

	}

	getProductoresBeats(){

		if(this.identity){
			var id = this.identity._id;
		}else {
			id = "";
		}
		
		this._userService.getProductoresYSeguidores(id).subscribe(
			response => {
				if(!response.productores){
					this.estado = 'error';
				}else {
					this.productores = response.productores;
					this.totalProductores = response.total;

					if(this.identity) this.follows = response.users_following;

					this.primeProductor = this.productores['0'];
					this.productorSeleccionado = this.primeProductor._id;

					this.getBeatsUsuario(this.primeProductor.nick, true);

					this.productores.forEach((productor) => {
						this.totalBeatsUsuario(productor._id);
						this.totalReproduccionesBeatsUsuario(productor._id);	
					});

					console.log(this.productores);
					console.log(this.follows);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}
		);
	}

	seleccionarProductor(productor){
		this.productorSeleccionado = productor._id;
		alert(this.productorSeleccionado);
		this.getBeatsUsuario(productor.nick, true);
	}

	

	getBeatsUsuario(nick, iniciarReproductor = false){
		this._beatService.getBeatsUsuario(nick).subscribe(
			response => {
				if(response.beats){
					this.totalBeats = response.total;
					this.beats = response.beats;
					console.log(this.beats);

					this.primerBeat = this.beats['0'];
          			this.beatSeleccionado = this.primerBeat;
					this.idBeat1 = this.primerBeat._id;

					if(iniciarReproductor == true) {
						this.getBeat(this.idBeat1, true); //idBeat, iniciarReproductor , sumarReproduccion
					} else {
						this.getBeat(this.idBeat1, false); //idBeat, iniciarReproductor , sumarReproduccion
					}					
					
					
				}else{
					this.estado = 'error';
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.estado= 'error';
				}
			}
		);
	}

	getBeat(id, iniciarReproductor = false) {
		this._beatService.getBeat(id).subscribe(
		  response => {
			if (!response.beat) {
			  alert("No existe el beat");
	
			} else {
			 
				this.beat = response.beat;
				console.log(this.beat);
				this.selecionarBeat(this.beat);
	
			  var that = this;
			  setTimeout(function () {
				let file_path = that.url + 'get-audio-beat/' + response.beat.file;
				document.getElementById("audio-reproductor-general").setAttribute("src", file_path);
	
				if (iniciarReproductor == true) {
				  (document.getElementById("audio-reproductor-general") as any).load();
				  (document.getElementById("audio-reproductor-general") as any).play();
				  that.sonando = true;
				  that.sumaReproduccion();
				}
			  }, 300);
			}
		  },
		  error => {
			var errorMessage = <any>error;
			console.log(errorMessage);
	
			if (errorMessage != null) {
			  this.estado = 'error';
			}
		  }
		);
	}

	selecionarBeat(beat){
		this.beat = beat;
    	this.idBeat1 = this.beat._id;

	
		var beat_selecionado = JSON.stringify(beat);
		localStorage.setItem('beat_seleccionado', beat_selecionado);
	}

	sumaReproduccion(){
		var that = this;
		this.socket.emit('sumar-reproduccion', this.beat, this.beat.user.nick);
		
		return false;
	}



	startPlayer(beat){
		var audioImpro = (<any>document.querySelector("#audio-impro"));
		audioImpro.load();


		let beat_player = JSON.stringify(beat);
		let file_path = this.url + 'get-audio-beat/' + beat.file;

		let image_beat_path = this.url + 'get-imagen-beat/' + beat.image;
		// let image_user_path = this.url + 'get-image-user/' + beat.user.image;

		localStorage.setItem('beat_sonando', beat_player);

		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById("nombre-beat").innerHTML = beat.name;
		document.getElementById("autor-beat").innerHTML = beat.user.nick;
		document.getElementById("img-beat").setAttribute("src", image_beat_path);

		$(".track").removeClass('track-activo');
		$("."+beat._id).addClass("track-activo");
		// document.querySelector("."+beat._id).setAttribute("class", 'track track-activo');

	}

	refresh(event = null){
		this.getProductoresBeats();
	}

	followUser(id_followed){
		var follow = new Follow('', this.identity._id,id_followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if(!response.follow){
					this.estado = 'error';
				}else {
					this.estado = 'success';
					this.follows.push(id_followed);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}
		);
	}

	unFollowUser(id_followed){
		this._followService.deleteFollow(this.token, id_followed).subscribe(
			response => {
				var search = this.follows.indexOf(id_followed);
				if(search != -1){
					this.follows.splice(search,1);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}
		);
	}

	sumarSeguidorUsuario(idUsuario) {
		console.log(idUsuario);

		this._followService.sumarSeguidor(this.token,idUsuario).subscribe(
			response => {
				if(!response.usuario){
					this.estado = 'error';
				}else {
					console.log(response.usuario);
					this.estado = 'success';
					this.refresh();
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}

		);
	}

	restarSeguidorUsuario(idUsuario) {
		console.log(idUsuario);

		this._followService.restarSeguidor(this.token,idUsuario).subscribe(
			response => {
				if(!response.usuario){
					this.estado = 'error';
				}else {
					console.log(response.usuario);
					this.estado = 'success';
					this.refresh();
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}

		);
	}


	

	public totalesBeats = [];
	totalBeatsUsuario(idUsuario){
		this._userService.contadorBeatsUsuario(idUsuario).subscribe(
			response => {
				if(response.total){
					
					var totalBeats = response.total;

					this.totalesBeats.push(totalBeats);
					console.log(this.totalesBeats);
				}else {
					this.estado = 'error';
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}
		)
	}

	public totalesReproduccionesBeats = [];
	totalReproduccionesBeatsUsuario(idUsuario){
		this._userService.contadorReproduccionesBeatsUsuario(idUsuario).subscribe(
			response => {
				if(response.total){
					
					var totalReproduccionesBeats = response.total;

					this.totalesReproduccionesBeats.push(totalReproduccionesBeats);
					console.log(this.totalesReproduccionesBeats);
				}else {
					this.estado = 'error';
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.estado = 'error';
				}
			}
		)
	}

	activarDesactivarDropdown(tipoDropdown){

	}

}
