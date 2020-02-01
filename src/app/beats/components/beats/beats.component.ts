import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import { User } from '../../../models/user';
// import { Beat } from '../../../models/beat';
import { LikeBeat } from '../../../models/like-beat';
import { FavoritoBeat } from '../../../models/favorito-beat';

import sortBy from 'sort-by';

import * as io from 'socket.io-client';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { LikeBeatService } from '../../../services/like-beat.service';
import { FavoritoService } from '../../../services/favorito.service';


import { GLOBAL } from '../../../services/global';
import { AudioContext } from 'angular-audio-context';

import { saveAs } from 'file-saver';

export interface Fruit {
	name: string;
}

export interface OpcionFiltroOrden {
	value: string;
	viewValue: string;
}

export interface Estilo {
	value: string;
	viewValue: string;
}

export interface Beat {
	id: Number,
	titulo: String,
	autor: String,
	imgPerfil: String,
	estilos: String,
	caratula: String,
}

@Component({
  selector: 'beats',
  templateUrl: './beats.component.html',
  providers: [UserService, BeatService, LikeBeatService, FavoritoService]
})

export class BeatsComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	public tipoVista = 'grid';

	public filtroOrden = 'mas-recientes';

	public opcionesFiltroOrden: OpcionFiltroOrden[] = [
		{value: 'mas-recientes', viewValue: 'Más recientes'},
		{value: 'mas-antiguas', viewValue: 'Más antiguas'},
		{value: 'mas-reputadas', viewValue: 'Más reputadas'},
		{value: 'mas-reproducidas', viewValue: 'Más reproducidas'},
	];

	public estilos: Estilo[] = [
		{value: 'old-school', viewValue: 'Old School'},
		{value: 'underground', viewValue: 'Underground'},
		{value: 'boom-bap', viewValue: 'Boom Bap'},
		{value: 'trap', viewValue: 'Trap'},
		{value: 'jazzy', viewValue: 'Jazzy'},
		{value: 'lofi', viewValue: 'Lofi'},
		{value: 'reggae', viewValue: 'Reggae'},
		{value: 'dancehall', viewValue: 'Dancehall'},
	];

	public estilosSeleccionados: Estilo[] = [];
	public mostrarTodas = true;
	
	public beats: Beat[] = [
		{
		  "id": 1,
		  "titulo": "Stuck In A Dream (feat. Gunna)",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#OldSchool #Underground",
		  "caratula": "https://i1.sndcdn.com/artworks-SLi3DRtVUIgd-0-t500x500.jpg",
		},
		{
		  "id": 2,
		  "titulo": "Love Me More",
		  "autor": "KAPO 013 BARCELONA",
		  "imgPerfil": "https://yt3.ggpht.com/a/AGF-l7-usCpVpi4SwaUO9oRNZbnOpHpcSPKQ-SRWww=s48-c-k-c0xffffffff-no-rj-mo",
		  "estilos": "#BoomBap #Jazzy",
		  "caratula": "https://i1.sndcdn.com/artworks-000627582724-p835rv-t500x500.jpg",
		},
		{
		  "id": 3,
		  "titulo": "Bandit ft. NBA Youngboy",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#Trap",
		  "caratula": "https://i1.sndcdn.com/artworks-000607413409-8kknp0-t500x500.jpg",
		},
		{
		  "id": 4,
		  "titulo": "Camelot",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#OldSchool #BoomBap",
		  "caratula": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		},
		{
		  "id": 5,
		  "titulo": "Stuck In A Dream (feat. Gunna)",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#OldSchool #Underground",
		  "caratula": "https://i1.sndcdn.com/artworks-SLi3DRtVUIgd-0-t500x500.jpg",
		},
		{
		  "id": 6,
		  "titulo": "Love Me More",
		  "autor": "KAPO 013 BARCELONA",
		  "imgPerfil": "https://yt3.ggpht.com/a/AGF-l7-usCpVpi4SwaUO9oRNZbnOpHpcSPKQ-SRWww=s48-c-k-c0xffffffff-no-rj-mo",
		  "estilos": "#BoomBap #Jazzy",
		  "caratula": "https://i1.sndcdn.com/artworks-000627582724-p835rv-t500x500.jpg",
		},
		{
		  "id": 7,
		  "titulo": "Bandit ft. NBA Youngboy",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#Trap",
		  "caratula": "https://i1.sndcdn.com/artworks-000607413409-8kknp0-t500x500.jpg",
		},
		{
		  "id": 8,
		  "titulo": "Camelot",
		  "autor": "alexgp895",
		  "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		  "estilos": "#OldSchool #BoomBap",
		  "caratula": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
		}
	];
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
		private _audioContext: AudioContext,
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

	abrirBarraReproductor(){
		$("body").addClass("barra-reproductor-general-visible");
	}

	public beep(){
        const oscillatorNode = this._audioContext.createOscillator();
 
        oscillatorNode.onended = () => oscillatorNode.disconnect();
        oscillatorNode.connect(this._audioContext.destination);
 
        oscillatorNode.start();
        oscillatorNode.stop(this._audioContext.currentTime + 0.5);
	}
	
	public source;
	getData() {
		this.source = this._audioContext.createBufferSource();
		var request = new XMLHttpRequest();
	  
		request.open('GET', 'https://rapdise.com/api/get-audio-beat/qn-J4IUgcPf6bG_ftwsCtvt1.mp3', true);
	  
		request.responseType = 'arraybuffer';
	  
		var that = this;
		request.onload = function() {
		  var audioData = request.response;
	  
		  that._audioContext.decodeAudioData(audioData, function(buffer) {
			  that.source.buffer = buffer;
	  
			  that.source.connect(that._audioContext.destination);
			  that.source.loop = true;
			},
	  
			function(e){ console.log("Error with decoding audio data"); });
	  
		}
	  
		request.send();
	}

	playAudio(){
		this.getData();
  		this.source.start(0);
	}

	ngOnInit(){
		console.log('Componente de beats cargado!');
		this.abrirBarraReproductor();
		// this.getBeats(true,true);
	}

	setTipoVista(tipo){ // grid o lista
		this.tipoVista = tipo;
	}

	seleccionarDeseleccionarEstilo(estiloRecibido){
		if(this.estilosSeleccionados.indexOf(estiloRecibido) != -1){
			const index = this.estilosSeleccionados.findIndex(estilo => estilo.value === estiloRecibido.value); 
			this.estilosSeleccionados.splice(index, 1);
		} else {
			console.log(estiloRecibido)
			this.estilosSeleccionados.push(estiloRecibido);
			console.log(this.estilosSeleccionados);

			if(this.estilosSeleccionados.length > 0){
				this.mostrarTodas = false;
			}

			if(this.estilosSeleccionados.length == this.estilos.length){
				this.seleccionarMostrarTodas()
			}
		}
	}

	seleccionarMostrarTodas(){
		this.mostrarTodas = true;
		this.estilosSeleccionados = [];
	}




	// REVISAR DE AQUI A ABAJO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ************!!!!!!!!!!!!!!!!!!!!!!!!!
	getReproductorSonando(event):void{
		this.sonando = event.sonando;
	}

	sticky(){
		
			var distance = $('.cabecera-biblioteca').offset().top;
			var $window = $(window);

			$(".container-biblioteca").scroll(function() {
				if ( $(".container-biblioteca").scrollTop() > distance ) {
					// Your div has reached the top
					$(".contenido-biblioteca").addClass("sticky");
				} 
			});
	}


	cargarSocket(){
		var that = this;
	
		this.socket.on('beat', function(beat, totalReproducciones){
			this.totalReproducciones = totalReproducciones;

			that.render(beat);
			this.beat = beat;
		});
	}  
	
	render(beat){
		let reproduccionesBeat = beat.reproducciones;

		if(beat){
			var elementoReproducciones = document.querySelector(".reproducciones-beat-"+beat._id);

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

	getBeat(id, iniciarReproductor = false, event = null) {
		this._beatService.getBeat(id).subscribe(
		  response => {
			if (!response.beat) {
	
			} else {
			 
				this.beat = response.beat;
				console.log(this.beat);
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

			var valueBeatSiguiente = $("#"+numBeatSiguiente).attr("value");
			var partesValueBeatSiguiente = valueBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

			var idBeatSiguiente = partesValueBeatSiguiente[2];

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
	
				var valueBeatAnterior = $("#"+numBeatAnterior).attr("value");
				var partesClaseBeatAnterior = valueBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatAnterior = partesClaseBeatAnterior[2];
				that.getBeat(idBeatAnterior, true);
	
	
			} else if(event.direccion == "siguiente"){
				var numBeatSiguiente = idNumBeat*1+1;
	
				if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
				}
	
				var valueBeatSiguiente = $("#"+numBeatSiguiente).attr("value");
				var partesValueBeatSiguiente = valueBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatSiguiente = partesValueBeatSiguiente[2];
	
				that.getBeat(idBeatSiguiente, true);
			}
		}

		if(direccion != null){
			if(direccion == "anterior"){
				var numBeatAnterior = idNumBeat*1-1;
				
				if(numBeatAnterior < 1){
				numBeatAnterior = that.totalBeats;
				}
	
				var valueBeatAnterior = $("#"+numBeatAnterior).attr("value");
				var partesClaseBeatAnterior = valueBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatAnterior = partesClaseBeatAnterior[2];
				that.getBeat(idBeatAnterior, true);
	
	
			} else if(direccion == "siguiente"){
				var numBeatSiguiente = idNumBeat*1+1;
	
				if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
				}
	
				var valueBeatSiguiente = $("#"+numBeatSiguiente).attr("value");
				var partesValueBeatSiguiente = valueBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
				var idBeatSiguiente = partesValueBeatSiguiente[2];
	
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
		this.getBeats(false,false);
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
}
