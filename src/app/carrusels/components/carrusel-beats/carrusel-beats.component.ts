import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import * as io from 'socket.io-client';


import { User } from '../../../models/user';
import { Destacado } from '../../../models/destacado';



import { UserService } from '../../../services/user.service';

import { DestacadoService } from '../../../services/destacado.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'carrusel-beats',
  templateUrl: './carrusel-beats.component.html',
  providers: [UserService, DestacadoService]
})

export class CarruselBeatsComponent implements OnInit {
	public url: string;
	public status: string;

	public identity;
	public token;

	public destacado: Destacado;
	public destacados: Destacado[];
	public totalDestacados;

	public paginasCarrusel;
	public paginaActual;

	public indexCarrusel = 1;
	public moverPixels = 0;

	public socket: SocketIOClient.Socket;
	public urlSocket;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _destacadoService: DestacadoService
	){
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);
	}
	
	ngOnInit(){
		console.log('Carrusel de beats cargado');
		this.getDestacados('beat')
		this.cargarSocket();
	}

	getDestacados(tipo){
		this._destacadoService.getDestacados(tipo).subscribe(
		  response => {
			if(response.destacados){
			  this.destacados = response.destacados;
			  this.totalDestacados = response.total;
	
			  console.log("Beats destacados: ", this.destacados);
			  console.log(this.totalDestacados);
			}
		  },
		  error => {
	
		  }
		)
	}
	
	formatearSegundos(tiempo){
		tiempo = Math.round(tiempo);

		var minutos = Math.floor(tiempo / 60);
		var segundos = (tiempo - minutos * 60 as any);
	
		segundos = segundos < 10 ? '0' + segundos : segundos;

		return minutos + ":" + segundos;
	}	

	public sonando = false;
	public beatActivo;

	seleccionarBeat(beat){

	}

	playPauseBeat(beat, accion){ // accion -> play/pause
		
		
		let urlBeat = this.url + 'get-audio-beat/' + beat.file;
		let idBeat = beat._id;
		let cardPlayer = $("#player-card-beat-"+idBeat);

		let audioBeat = (document.querySelector("#audio-carrusel-beats") as any);

		if(accion == 'play'){
			$(".card__player").removeClass("player-visible");
			cardPlayer.addClass("player-visible");

			if(!this.beatActivo || this.beatActivo && this.beatActivo._id != beat._id){ // si el beat que esta sonando es igual al beat beat clicado
				audioBeat.setAttribute("src", urlBeat);
				this.sumaReproduccion(beat);
			}

			this.beatActivo = beat;			
			
			audioBeat.play();
			this.sonando = true;
			
		}else if (accion == 'pause') {
			audioBeat.pause();
			this.sonando = false;
		}	

		audioBeat.ontimeupdate = function () {
			var porcentaje = (audioBeat.currentTime / audioBeat.duration) * 100;
			$("#barra-beat-"+idBeat+" .tiempo-actual-barra-player").css("width", porcentaje + "%");			
			
			if(audioBeat.currentTime >= audioBeat.duration){
				alert("stop");		
			}
			
		};

		$("#barra-beat-"+idBeat).on("click", function (e) {
			// GENERAR NUEVO TIEMPO AL CLICAR LA BARRA
			var offset = $(this).offset();
			var left = (e.pageX - offset.left);
			var totalWidth = $("#barra-beat-"+idBeat).width();
			var porcentaje = (left / totalWidth);
			var nuevoTiempo = audioBeat.duration * porcentaje;
			audioBeat.currentTime = nuevoTiempo

			
		});//click()

	}

	reproductorVistaPrevia() {
		var beat = (<any>document.getElementById("beat_grabacion"));
		var that = this;

		beat.ontimeupdate = function () {
			var porcentaje = (beat.currentTime / beat.duration) * 100;
			$(".tiempo-actual-barra-player").css("width", porcentaje + "%");			
			
			if(beat.currentTime >= beat.duration){
				alert("stop");						
			}
			
		};

		beat.onplaying = function () {
			that.sonando = true;

		}

		beat.onpause = function () {
			that.sonando = false;
		}

		$(".barra-reproductor-vista-previa").on("click", function (e) {
			
			var offset = $(this).offset();
			var left = (e.pageX - offset.left);
			var totalWidth = $(".barra-reproductor-vista-previa").width();
			var porcentaje = (left / totalWidth);
			var nuevoTiempo = beat.duration * porcentaje;
			beat.currentTime = nuevoTiempo

			
		});//click()
	}

	sumaReproduccion(beat){
		var that = this;
		this.socket.emit('sumar-reproduccion', beat, beat.user.nick);
		
		return false;
	}

	cargarSocket(){
		var that = this;
	
		this.socket.on('beat', function(beat, totalReproducciones){
			console.log(beat);

			that.render(beat);
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
}
