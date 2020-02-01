import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'reproductor',
  templateUrl: './reproductor.component.html',
  providers: [UserService, BeatService]
})

export class ReproductorComponent implements OnInit {
	public identity;
	public token;
	public url;
	public status;
	public beats: Beat[];
	public total;
	public beatAleatorio;
	public beat;
	constructor(
		private _userService: UserService,
		private _beatService: BeatService
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.beat = new Beat("","Live Jazz","jazzy", "", "RB7xKfVhJF-dUYMLRH4VSbei.mp3","","","","",true,true,true,"","","","","","","","");
	}
	ngOnInit(){
		console.log('Reproductor cargado');

		this.getBeats();


		var audio = (<any>document.getElementById("player"));
		audio.volume = (<any>document.getElementById("volume")).value;
		(<any>document.getElementById("volume")).onchange = function(e){audio.volume = e.target.value};

		audio.ontimeupdate = function(){
		  var percentage = ( audio.currentTime / audio.duration ) * 100;
		  $("#custom-seekbar span").css("width", percentage+"%");
		};

		audio.onended = function() {
			$("#boton-pause").css("display", "none");
			$("#boton-play").css("display", "inline-block");

			audio.load();
			audio.play();
		}

		audio.onplaying = function() {
			$("#boton-play").css("display", "none");
			$("#boton-pause").css("display", "flex");
		}

		audio.onpause = function(){
			$("#boton-pause").css("display", "none");
			$("#boton-play").css("display", "inline-block");
		}

		$("#custom-seekbar").on("click", function(e){
		    var offset = $(this).offset();
		    var left = (e.pageX - offset.left);
		    var totalWidth = $("#custom-seekbar").width();
		    var percentage = ( left / totalWidth );
		    var audioTime = audio.duration * percentage;
		    audio.currentTime = audioTime;
		});//click()

	}

	getBeats(){
		var id;

		if(this.identity){
			id = this.identity._id;
		} else {
			id = "";
		}
		this._beatService.getBeats(id).subscribe(
			response => {
				if(response.beats){
					this.total = response.total;
					this.beats = response.beats;
					this.beatAleatorio = this.beats[Math.floor(Math.random() * (this.total))];

					console.log(this.beatAleatorio);

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

	reproducirAudio(){
		$("#boton-play").css("display", "none");
		$("#boton-pause").css("display", "flex");
		var audio = (<any>document.getElementById("player"));
		audio.play();
	}

	pararAudio(){
		$("#boton-pause").css("display", "none");
		$("#boton-play").css("display", "inline-block");
		var audio = (<any>document.getElementById("player"));
		audio.pause();
	}

	ocultarReproductor(id){
		$("#"+id).fadeOut();
		$("#mostrar-reproductor").fadeIn();
		$(".reproductor-fijo").addClass("reproductor-oculto");
		
		$(".footer").css("margin-bottom", "0");
		$(".mCustomScrollbar").css("max-height", "100%");
	}

	mostrarReproductor(id){
		$("#"+id).fadeOut();
		$("#ocultar-reproductor").fadeIn();
		$(".reproductor-fijo").removeClass("reproductor-oculto");
		
		$(".footer").css("margin-bottom", "50px");
		$(".mCustomScrollbar").css("max-height", "calc(100vh - 70px)");
	}
}