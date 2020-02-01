import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import Swal  from 'sweetalert2';

import * as io from 'socket.io-client';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { LikeBeat } from '../../../models/like-beat';
import { FavoritoBeat } from '../../../models/favorito-beat';
import { Follow } from '../../../models/follow';

import { Lista } from '../../../models/lista'

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { LikeBeatService } from '../../../services/like-beat.service';
import { FavoritoService } from '../../../services/favorito.service';

import { FollowService } from '../../../services/follow.service';

import { ListaService } from '../../../services/lista.service';

import sortBy from 'sort-by';
import { saveAs } from 'file-saver';


import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'listas-beats-usuario',
  templateUrl: './listas-beats-usuario.component.html',
  providers: [UserService, ListaService, BeatService, LikeBeatService, FavoritoService, FollowService]
})

export class ListasBeatsUsuarioComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public estado: string;
	
	//listas
	public listas: Lista[];
	public totalListas;
	public beatsLista;
	public totalBeatsLista;
	public estilosLista: String[];

	

	public lista;
	public primeraLista;
	public listaSeleccionada;
	public idLista1;


	public user;

	public estilosProductor: String[];

	// beats
	public beats: Beat[];
	public totalBeats;

	public beat;
	public primerBeat;
	public idBeat1;

	public beatEnBucle: boolean = false;
	public sonando = true;
	
	// likes-favoritos de beats
	public likes;
	public totalLikes;

	public favoritos;
	public totalFavoritos;

	public beatsFavoritos: FavoritoBeat[];
	public totalBeatsFavoritos;

	public modalCrearListaAbierto = false;
	public modalEditarListaAbierto = false;

	public listaAEditar: Lista;

	public follows;

	public filtroBeat = "";


	public mensajes: Array<any> = [{
		id: 1,
		texto: 'Bienvenido al chat publico creado con Socket.io y NodeJS',
		nick: 'AlexGimipiki95'
	  }];
	
	public socket: SocketIOClient.Socket;
	public urlSocket;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _listaService: ListaService,
		private _beatService: BeatService,
		private _likeBeatService: LikeBeatService,
		private _favoritoService: FavoritoService,
		private _followService: FollowService

	){
		this.titulo = 'Listas de beats';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);

		if(this.identity) this.follow = new Follow("",this.identity._id, "");
		
	}
	ngOnDestroy(){
		$(".footer").css("display", "block");
	}
	ngOnInit(){
		console.log('Componente de listas de beats cargado!');
		this.getLikesYFavoritosDeBeats();

		if(this.identity) this.getFollowsUsuarioIdentificado();

		this.cargarPagina();

		$(".footer").css("display", "none");

		var that = this;
		setTimeout( function(){
			that.cambiarBeatAlFinalizar();
		}, 1000 );

	}

	cerrarModal(tipo){

	}

	refrescar(event){

	}


	cargarPagina(){
		this._route.params.subscribe(params => {
			let nick = params['nick'];
			let style = 'trap';
			this.getUsuario(nick);

			this.getBeatsUsuario(nick, true, false); // nickUsuario, iniciarReproductor

			

			this.cargarSocket();
			
			this.titulo = 'Todos los beats de ' + nick;

		});
	}

	getReproductorSonando(event):void{
		this.sonando = event.sonando;
	}

	sticky(){
		
			var distance = $('.cabecera-biblioteca').offset().top;
			alert(distance);
			var $window = $(window);

			$(".container-biblioteca").scroll(function() {
				alert($(".container-biblioteca").scrollTop());
				if ( $(".container-biblioteca").scrollTop() > distance ) {
					// Your div has reached the top
					$(".contenido-biblioteca").addClass("sticky");
				} 
			});
	}


	cargarSocket(){
		var that = this;
	
		this.socket.on('beat', function(beat, totalReproducciones){
			console.log(beat);
			this.totalReproducciones = totalReproducciones;
			console.log(this.totalReproducciones);

			that.render(beat);
			this.beat = beat;
			console.log(this.totalReproducciones);
		});
	}  
	
	render(beat){
		let reproduccionesBeat = beat.reproducciones;

		if(beat){
			var elementoReproducciones = document.querySelector(".reproducciones-beat-"+beat._id);

			if(elementoReproducciones != null) {
				elementoReproducciones.innerHTML = reproduccionesBeat;
				this.totalReproducciones == this.totalReproducciones++;
			}
		}
	}
	
	sumaReproduccion(){

		this.socket.emit('sumar-reproduccion', this.beat, this.user.nick);
		
		return false;
	}

	getUsuario(nick){
		this._userService.getUser(nick).subscribe(
			response => {
				if(response.user){
					this.user = response.user;
					console.log(this.user);

					
				}else {
					this.estado = 'error';
				}

			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);
				if(mensajeError != null){
					this.estado = 'error';
				}
			}
		)
	}

	getBeatsUsuario(nick, getBeat = true, iniciarReproductor = false){
		this._beatService.getBeatsUsuario(nick).subscribe(
			response => {
				if(response.beats){
					
					
					this.beats = response.beats;
					this.totalBeats = response.total;

					this.primerBeat = this.beats['0'];

					if(getBeat == true){
						if (iniciarReproductor == true) {
							this.getBeat(this.primerBeat._id, true);
						} else {
							this.getBeat(this.primerBeat._id);
						}
					}

					this.reproduccionesBeatsUsuario();
					
					
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

	getLikesYFavoritosDeBeats(){
		var idUsuario;
		if(this.identity){
			idUsuario = this.identity._id;
		} else {
			idUsuario = "";
		}
		
		this._beatService.getBeats(idUsuario).subscribe( //Solo necesito likes y favoritos - ( No necesito recibir los beats)
			response => {
				if(response.beats){
					
					this.likes = response.beats_me_gustan;
					if(this.likes) this.totalLikes = this.likes.length;

					this.favoritos = response.beats_favoritos;
					if(this.favoritos) this.totalFavoritos = this.favoritos.length;
					

				}else{
					this.estado = 'error';
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.estado = 'error';
				}
			}
		);
	}

	getFollowsUsuarioIdentificado(){

			this._userService.getProductoresYSeguidores(this.identity._id).subscribe(
				response => {
					if(!response.productores){
						this.estado = 'error';
					}else {
						this.follows = response.users_following;
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

	

	public totalReproducciones:number;
	reproduccionesBeatsUsuario(){
		this.totalReproducciones = 0;
		this.beats.forEach((beat, index) => {
			
			this.totalReproducciones = this.totalReproducciones+parseInt(beat.reproducciones);


			console.log(this.totalReproducciones);
		});
	}

	getBeat(id, iniciarReproductor = false, event = null) {
		this._beatService.getBeat(id).subscribe(
		  response => {
			if (!response.beat) {
			  alert("No existe el beat");
	
			} else {
			 
				this.beat = response.beat;
				var that = this;

				this.usuariosQueSigo();

				if(event != null){ // cuando se usa getBeat() en el evento (click)=""
					if(id == this.idBeat1){
						if(this.sonando){
							console.log("Ya esta sonando este beat");
						} else {
							this.playBeat(true, this.beat); // iniciarReproductor, beat, load
						}

					} else if(id != this.idBeat1) {
						
						this.playBeat(true, this.beat, true);
					}
				} else {
					

					this.playBeat(true, this.beat, true);
				}
	
				
				
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

	playBeat(iniciarReproductor, beat, load = false){
		var that = this;
		setTimeout(function () {
			let file_path = that.url + 'get-audio-beat/' + beat.file;
			

			if (iniciarReproductor == true) {
				if(load == true) {
					document.getElementById("audio-reproductor-general").setAttribute("src", file_path);
					(document.getElementById("audio-reproductor-general") as any).load();

					that.sumaReproduccion();
				}
				(document.getElementById("audio-reproductor-general") as any).play();
			}
		}, 300);
		this.selecionarBeat(this.beat);
	}

	pauseBeat(){
		(document.getElementById("audio-reproductor-general") as any).pause();
	}


	selecionarBeat(beat){
		this.beat = beat;
    	this.idBeat1 = this.beat._id;

	
		var beat_selecionado = JSON.stringify(beat);
		localStorage.setItem('beat_seleccionado', beat_selecionado);
	}

	cambiarBeatAlFinalizar(){
		var audio = (<any>document.getElementById("audio-reproductor-general"));
		var that = this;

		audio.onended = function(){
			var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");

			var numBeatSiguiente = idNumBeat*1+1;
		
			if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
			}

			var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
			var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

			var idBeatSiguiente = partesClaseBeatSiguiente[2];

			if(that.beatEnBucle == false){
				that.getBeat(idBeatSiguiente, true);
			} else {
				that.getBeat(that.beat._id, true);
			}
		};
  	}


	cambiarBeat(event = null, direccion = null){
		var that = this;
		var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");
		
		if(event != null && event.direccion){
			if(event.direccion == "anterior"){
				var numBeatAnterior = idNumBeat*1-1;
				
				if(numBeatAnterior < 1){
				numBeatAnterior = that.totalBeats;
				}
	
				var claseBeatAnterior = $("#"+numBeatAnterior).attr("class");
				var partesClaseBeatAnterior = claseBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatAnterior = partesClaseBeatAnterior[2];
				that.getBeat(idBeatAnterior, true);
	
	
			} else if(event.direccion == "siguiente"){
				var numBeatSiguiente = idNumBeat*1+1;
	
				if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
				}
	
				var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
				var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatSiguiente = partesClaseBeatSiguiente[2];
	
				that.getBeat(idBeatSiguiente, true);
			}
		}

		if(direccion != null){
			if(direccion == "anterior"){
				var numBeatAnterior = idNumBeat*1-1;
				
				if(numBeatAnterior < 1){
				numBeatAnterior = that.totalBeats;
				}
	
				var claseBeatAnterior = $("#"+numBeatAnterior).attr("class");
				var partesClaseBeatAnterior = claseBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatAnterior = partesClaseBeatAnterior[2];
				that.getBeat(idBeatAnterior, true);
	
	
			} else if(direccion == "siguiente"){
				var numBeatSiguiente = idNumBeat*1+1;
	
				if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
				}
	
				var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
				var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatSiguiente = partesClaseBeatSiguiente[2];
	
				that.getBeat(idBeatSiguiente, true);
			}
		}
		

	}

	activarDesactivarBeatEnBucle(event):void{ //Output (viene de reproductor-biblioteca)
		this.beatEnBucle = event.beatEnBucle;
	}
	
	recibirBeat(event = null){

		if(event.idBeat && event.iniciarReproductor){
			this.getBeat(event.idBeat, event.iniciarReproductor);
		}
		
	}

	



	// LIKES Y FAVORITOS BEAT

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
					this.estado = 'error';
				}else {
					this.estado = 'success';
					this.likes.push(beat);
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
					this.estado = 'error';
				}
			}
		);
	}

	sumarLikeBeat(beat_id) {
		console.log(beat_id);

		this._beatService.sumarLikeBeat(beat_id).subscribe(
			response => {
				if(!response.beat){
					this.estado = 'error';
				}else {
					console.log(response.beat);
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

	restarLikeBeat(beat_id) {
		console.log(beat_id);

		this._beatService.restarLikeBeat(beat_id).subscribe(
			response => {
				if(!response.beat){
					this.estado = 'error';
				}else {
					console.log(response.beat);
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

	favoritoBeat(beat){
		var favorito = new FavoritoBeat('', this.identity._id, beat, '');

		this._favoritoService.addFavoritoBeat(this.token, favorito).subscribe(
			response => {
				if(!response.favorito){
					this.estado = 'error';
				}else {
					this.estado = 'success';
					this.favoritos.push(beat);
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
					this.estado = 'error';
				}
			}
		);
	}


	descargar(nombreArchivo){

        this._beatService.descargarBeat(nombreArchivo).subscribe(
            response => saveAs(response, nombreArchivo),
            error => console.error(error)
        );

	}
	
	activarDesactivarDropdown(tipoDropdown){
		if(tipoDropdown == 'estilo'){
			document.getElementById("menu-dropdown-estilos").classList.toggle("activo");
			
		} else if( tipoDropdown == 'filtros') {

			document.getElementById("menu-dropdown-filtros").classList.toggle("activo");
			
		}
	}

	public filtroSeleccionado = 'Más recientes';
	seleccionarFiltro(propiedad){

		if(propiedad == '-created_at') {
			this.filtroSeleccionado = 'Más recientes';
		}

		if(propiedad == 'created_at') {
			this.filtroSeleccionado = 'Más antiguas';
		}

		if(propiedad == '-likes') {
			this.filtroSeleccionado = 'Más reputadas';
		}

		if(propiedad == '-reproducciones') {
			this.filtroSeleccionado = 'Más reproducidas';
		}

		this.activarDesactivarDropdown('filtros');
		

	}

	getBeatsOrdenadosPor(propiedad){
		this.seleccionarFiltro(propiedad);
		this.beats = this.beats.sort(sortBy(propiedad));
		
	}



	getEstilosProductor(){
		this.estilosProductor = new Array();
		this.beats.forEach((beat, index) => {
			let estilo = beat.style;

			if(this.estilosProductor.indexOf(estilo) < 0) {
				this.estilosProductor.push(estilo);
			}
		});

		console.log(this.estilosProductor);
	}


	refreshUser(){
		this.getUsuario(this.user.nick);
	}

	refresh(event = null){
		this.getLikesYFavoritosDeBeats();
		this.getBeatsUsuario(this.user.nick,false, false);
	}



	 // SEGUIR USUARIO (PRODUCTOR) 
	 public totalFollows;
 
	 public follow: Follow;
 
	 public idsUsuariosQueSigo:any;
	 usuariosQueSigo(){
		 this._followService.usuariosQueSigo(this.token, this.identity._id).subscribe(
			 response => {
				 if(response.follows){
					 this.follows = response.follows;
					 this.totalFollows = response.total;
					 this.idsUsuariosQueSigo = response.idsUsuariosQueSigo;
 
					 this.comprobarSeguimientoUsuario();
 
					 GLOBAL.DEBUG && console.log(this.follows);
					 GLOBAL.DEBUG && console.log(this.totalFollows);
					 GLOBAL.DEBUG && console.log(this.idsUsuariosQueSigo);
				 } else {
					 this.estado = 'error';
				 }
			 }, 
			 error => {
				 var mensajeError = <any>error;
				 GLOBAL.DEBUG && console.log(mensajeError);
 
				 if(mensajeError != null){
					 this.estado = 'error';
				 }
			 }
		 )
	 }
 
	 public siguiendo = false;
 
	 comprobarSeguimientoUsuario(){
 
		 if(this.user && this.idsUsuariosQueSigo && this.idsUsuariosQueSigo.indexOf(this.user._id) >= 0){
			 this.siguiendo = true;
		 } else if(this.user && this.idsUsuariosQueSigo && this.idsUsuariosQueSigo.indexOf(this.user._id) < 0){
			 this.siguiendo = false;
		 }
	 }
 
	 
 
	 seguirUsuario(idUsuario){
		 this.follow.followed = idUsuario;
		 this._followService.addFollow(this.token, this.follow).subscribe(
			 response => {
				 if(response.follow){
					 GLOBAL.DEBUG && console.log(response.follow);
					 this.siguiendo = true;
 
				 } else {
					 this.estado = 'error';
				 }
			 }, 
			 error => {
				 var mensajeError = <any>error;
				 GLOBAL.DEBUG && console.log(mensajeError);
 
				 if(mensajeError != null){
					 this.estado = 'error';
				 }
			 }
		 )
	 }
 
	 dejarDeSeguirUsuario(idUsuario){
		 this._followService.deleteFollow(this.token, idUsuario).subscribe(
			 response => {
				 if(response){
					 GLOBAL.DEBUG && console.log(response.message)
					 this.siguiendo = false;
 
				 } else {
					 this.estado = 'error';
				 }
			 }, 
			 error => {
				 var mensajeError = <any>error;
				 GLOBAL.DEBUG && console.log(mensajeError);
 
				 if(mensajeError != null){
					 this.estado = 'error';
				 }
			 }
		 )
	 }
}
