import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { LikeBeat } from '../../../models/like-beat';
import { FavoritoBeat } from '../../../models/favorito-beat';

import sortBy from 'sort-by';

import * as io from 'socket.io-client';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { LikeBeatService } from '../../../services/like-beat.service';
import { FavoritoService } from '../../../services/favorito.service';


import { GLOBAL } from '../../../services/global';

import { saveAs } from 'file-saver';

@Component({
  selector: 'beats-estilo',
  templateUrl: './beats-estilo.component.html',
  providers: [UserService, BeatService, LikeBeatService, FavoritoService]
})

export class BeatsEstiloComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	
	public beats: Beat[];
	public totalBeats;

	public indexCarrusel = 2;
	public moverPixels = 0;
	  
	public likes;
	public totalLikes;

	public favoritos;
	public totalFavoritos;

	public beatsFavoritos: FavoritoBeat[];
	public totalBeatsFavoritos;

	public beat;
	public primerBeat;
	public idBeat1;

	public beatEnBucle: boolean = false;
	public sonando = true;


	public socket: SocketIOClient.Socket;
	public urlSocket;

	public filtroBeat = "";
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _likeBeatService: LikeBeatService,
		private _favoritoService: FavoritoService

	){
		this.titulo = 'Librería de beats';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);
	}
	ngOnInit(){
		console.log('Componente de beats cargado!');
		// this.contadorLikesBeat("5b205e128d6a5b24e0bff157");
		this.cargarPagina();

		$(".footer").addClass("display-none");

		var that = this;
		setTimeout( function(){
			that.cambiarBeatAlFinalizar();
			that.cargarSocket();
		}, 1000 );

		
			
		setTimeout( function(){
			$(".capa-controles-player").removeClass("capa-activa");
		}, 4000 );

		//Mi dropdown
		$(window).click(function(event:any){
			if (!event.target.matches('.btn-mi-dropdown div')) {
				var dropdowns = document.getElementsByClassName("menu-mi-dropdown");
				var that = this;
				var i;
				for (i = 0; i < dropdowns.length; i++) {
					var openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('activo')) {
						openDropdown.classList.remove('activo');
						that.activarDesactivarDropdown = false;

					}
				}				
			}
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

			that.render(beat);
			this.beat = beat;
			console.log(this.beat);
			console.log(this.totalReproducciones);
		});
	}  
	
	render(beat){
		let reproduccionesBeat = beat.reproducciones;

		if(beat){
			var elementoReproducciones = document.querySelector("#reproducciones-beat-"+beat._id);

			if(elementoReproducciones != null) elementoReproducciones.innerHTML = reproduccionesBeat;
		}
	}
	
	sumaReproduccion(){
		var that = this;
		this.socket.emit('sumar-reproduccion', this.beat, this.beat.user.nick);
		
		return false;
	}

	getBeats(getBeat = true, iniciarReproductor = false){
		var id;
		if(this.identity){
			id = this.identity._id;
		} else {
			id = "";
		}
		
		this._beatService.getBeats(id).subscribe(
			response => {
				if(response.beats){
					this.beats = response.beats;
					this.totalBeats = response.total;
					
					this.likes = response.beats_me_gustan;

					if(this.likes) this.totalLikes = this.likes.length;

					this.favoritos = response.beats_favoritos;
					if(this.favoritos) this.totalFavoritos = this.favoritos.length;

					this.primerBeat = this.beats['0'];

					if(getBeat == true){
						if (iniciarReproductor == true) {
							this.getBeat(this.primerBeat._id, true);
						} else {
							this.getBeat(this.primerBeat._id);
						}
					}
					

					console.log(this.beats);
					console.log("Total: " + this.totalBeats);
					console.log(this.idBeat1);

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

	public estilo;
	cargarPagina(){
		this._route.params.subscribe(params => {
			this.estilo = params['estilo'];

			this.getBeatsEstilo(this.estilo, true)
		});
	}

	getBeatsEstilo(estilo,getBeat = true, iniciarReproductor = false){
		var id;
		if(this.identity){
			id = this.identity._id;
		} else {
			id = "";
		}
		
		this._beatService.getBeatsEstilo(estilo,id).subscribe(
			response => {
				if(response.beats){
					this.beats = response.beats;
					this.totalBeats = response.total;
					
					this.likes = response.beats_me_gustan;

					if(this.likes) this.totalLikes = this.likes.length;

					this.favoritos = response.beats_favoritos;
					if(this.favoritos) this.totalFavoritos = this.favoritos.length;

					this.primerBeat = this.beats['0'];

					if(getBeat == true){
						if (iniciarReproductor == true) {
							this.getBeat(this.primerBeat._id, true);
						} else {
							this.getBeat(this.primerBeat._id);
						}
					}
					

					console.log(this.beats);
					console.log("Total: " + this.totalBeats);
					console.log(this.idBeat1);

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

	getBeat(id, iniciarReproductor = false, event = null) {
		this._beatService.getBeat(id).subscribe(
		  response => {
			if (!response.beat) {
			  alert("No existe el beat");
	
			} else {
			 
				this.beat = response.beat;
				var that = this;

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
			  this.status = 'error';
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
		this.getBeatsEstilo(this.estilo,false,false);
	}
	

	descargar(nombreArchivo){

        this._beatService.descargarBeat(nombreArchivo).subscribe(
            response => saveAs(response, nombreArchivo),
            error => console.error(error)
        );

	}
	
	public dropdownEstiloActivo = false;
	public dropdownFiltrosActivo = false;
	activarDesactivarDropdown(tipoDropdown){
		if(tipoDropdown == 'estilo'){
			document.getElementById("menu-dropdown-estilos").classList.toggle("activo");
			
		} else if( tipoDropdown == 'filtros') {
			// if(this.dropdownFiltrosActivo == false) {
			// 	this.dropdownFiltrosActivo = true;
			// } else {
			// 	this.dropdownFiltrosActivo = false;
			// }

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
}
