import { Component, OnInit, EventEmitter, Input, Output,  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import * as io from 'socket.io-client';

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
  selector: 'seleccion-beats-batalla',
  templateUrl: './seleccion-beats-batalla.component.html',
  providers: [UserService, BeatService, LikeBeatService, FavoritoService]
})

export class SeleccionBeatsBatallaComponent implements OnInit, OnChanges {
    // Decorador Output
    @Output() PasameElBeat = new EventEmitter();

    public identity;
    public token;
    public url;
    public status;
    public beats: Beat[];
    public totalBeats;

    public sonando = false;
    public beat;

    public beatAleatorio: boolean = false;
    public beatEnBucle: boolean = false;
    

    public primerBeat;
    public beatSeleccionado;
    public idBeat1;
    public idBeat2:string;
    public idBeat3:string;

    public filtroBeat = "";

    public beatsUsuario: Beat[];

    public likes;
	public totalLikes;

	public favoritos;
	public totalFavoritos;

	public beatsFavoritos: FavoritoBeat[];
    public totalBeatsFavoritos;
    
    public socket: SocketIOClient.Socket;
    public urlSocket;
    constructor(
        private _userService: UserService,
        private _beatService: BeatService,
        private _likeBeatService: LikeBeatService,
		private _favoritoService: FavoritoService,
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);
    }
    ngOnChanges(changes: SimpleChanges) {
        
  
            const beat: SimpleChange = changes.beat;

            if(beat){
                GLOBAL.DEBUG && console.log(beat);
                
                if(beat.currentValue){
                    this.getBeatsUsuario(beat.currentValue.user.nick);
                }
            }
            
            
        
    }
    ngOnInit() {
        GLOBAL.DEBUG && console.log('Reproductor cargado');
        
        var that = this;
        setTimeout( function(){
        that.reproductorBeat();
        }, 1000 );

        this.getBeats(true, false);

        setTimeout( function(){
			that.cambiarBeatAlFinalizar();
		}, 1000 );

        
    }

    public rondas;

    descargar(beat){

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
          
          this.idBeat1 = this.beats['0']._id;
          this.idBeat2 = this.beats['1']._id;
          this.idBeat3 = this.beats['2']._id;
					
					this.likes = response.beats_me_gustan;

					if(this.likes) this.totalLikes = this.likes.length;

					this.favoritos = response.beats_favoritos;
					if(this.favoritos) this.totalFavoritos = this.favoritos.length;

					this.primerBeat = this.beats['0'];
          this.beatSeleccionado = this.primerBeat;
					this.idBeat1 = this.primerBeat._id;

					if(getBeat == true){
						if (iniciarReproductor == true) {
							this.getBeat(this.idBeat1, true);
						} else {
							this.getBeat(this.idBeat1);
						}
					}
					

					GLOBAL.DEBUG && console.log(this.beats);
					GLOBAL.DEBUG && console.log("Total: " + this.totalBeats);
					GLOBAL.DEBUG && console.log(this.idBeat1);

				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				GLOBAL.DEBUG && console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
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
        GLOBAL.DEBUG && console.log(this.beat);
        this.beatSeleccionado = this.beat._id;
				
	
			  var that = this;
			  setTimeout(function () {
				let file_path = that.url + 'get-audio-beat/' + response.beat.file;
				document.getElementById("audio-reproductor-con-listado").setAttribute("src", file_path);
	
				if (iniciarReproductor == true) {
				  (document.getElementById("audio-reproductor-con-listado") as any).load();
				  (document.getElementById("audio-reproductor-con-listado") as any).play();
				  that.sonando = true;
				  that.sumaReproduccion();
				}
			  }, 300);
			}
		  },
		  error => {
			var errorMessage = <any>error;
			GLOBAL.DEBUG && console.log(errorMessage);
	
			if (errorMessage != null) {
			  this.status = 'error';
			}
		  }
		);
    }
    
    selecionarBeat(numRonda,beat){
		    this.beat = beat;
        alert("Ronda " + numRonda + " " + beat._id)

        if(numRonda == 1) this.idBeat1 = this.beat._id;
        if(numRonda == 2) this.idBeat2 = this.beat._id;
        if(numRonda == 3) this.idBeat3 = this.beat._id;
        
        // Usamos el método emit
        this.PasameElBeat.emit({beat: this.beat});
	
		    var beat_selecionado = JSON.stringify(beat);
		    localStorage.setItem('beat_seleccionado', beat_selecionado);
	  }
    


    reproductorBeat() {
        var audio = (<any>document.getElementById("audio-reproductor-con-listado"));
        var that = this;

        audio.ontimeupdate = function () {
        var percentage = (audio.currentTime / audio.duration) * 100;
        $(".mi-barra-tiempo-actual").css("width", percentage + "%");

        that.formatearTiempo(audio.currentTime, $("#tiempo-actual-beat-rep-general"));
        
        };

        audio.onplaying = function () {
        that.sonando = true;
        }

        audio.onpause = function () {
        that.sonando = false;
        }

        $("#mi-barra-player-1").on("click", function (e) {
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $("#mi-barra-player-1").width();
        var percentage = (left / totalWidth);
        var audioTime = audio.duration * percentage;
        audio.currentTime = audioTime;
        });//click()

        $("#mi-barra-player-1").mousemove(function (e) {
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        GLOBAL.DEBUG && console.log(left);
        var totalWidth = $("#mi-barra-player-1").width();
        var percentage = (left / totalWidth);
        var audioTime = audio.duration * percentage;
        GLOBAL.DEBUG && console.log(audioTime);

        if(audioTime < 0) { // controlar que no se pase y no baje de 0
            audioTime = 0;
        } else if (audioTime > audio.duration){
            audioTime = audio.duration;
        }
        
        that.formatearTiempo(audioTime, $("#tooltip-nuevo-tiempo-barra"));

        $(".posicion-barra-cursor").css("left", left + 'px');
        });//click()
    }

    formatearTiempo(segundos, elemento) {
        var minutos = (<any> Math.floor(segundos / 60));
        minutos = (minutos >= 10) ? minutos : minutos;
        segundos = Math.floor(segundos % 60);
        segundos = (segundos >= 10) ? segundos : "0"+ segundos;

        elemento.html(minutos + ":" + segundos);
    }


    playReproductor() {
        (document.getElementById("audio-reproductor-con-listado") as any).play();
        this.sonando = true;
    }

    pauseReproductor() {
        (document.getElementById("audio-reproductor-con-listado") as any).pause();
        this.sonando = false;
    }


    activarDesactivarBeatEnBucle(accion = null){
        if (!accion){
            if(this.beatEnBucle == false){
                this.beatEnBucle = true;
                $(".btn-bucle-player").addClass("activo");
                // this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
                if(this.beatAleatorio){
                    this.activarDesactivarBeatAleatorio('desactivar');
                }  
            }else if(this.beatEnBucle == true){
                this.beatEnBucle = false;
                $(".btn-bucle-player").removeClass("activo");
                // this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
            }
        } else if (accion == 'activar'){
            this.beatEnBucle = true;
            $(".btn-bucle-player").addClass("activo");
            // this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
        } else if (accion == 'desactivar'){
            this.beatEnBucle = false;
            $(".btn-bucle-player").removeClass("activo");
            // this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
        } 

    }

    
    activarDesactivarBeatAleatorio(accion = null){
        if (!accion){
            if(this.beatAleatorio == false){
                this.beatAleatorio = true;
                $("#btn-beat-aleatorio").addClass("activo");                
                if(this.beatEnBucle){
                    this.activarDesactivarBeatEnBucle('desactivar');
                }                
            }else if(this.beatAleatorio == true){
                this.beatAleatorio = false;
                $("#btn-beat-aleatorio").removeClass("activo");
            }            
        } else if (accion == 'activar'){
            this.beatAleatorio = true;
            $("#btn-beat-aleatorio").addClass("activo");             
        } else if (accion == 'desactivar'){
            this.beatAleatorio = false;
            $("#btn-beat-aleatorio").removeClass("activo");
        } 
        

    }

    cambiarBeat(direccion = null){
		var that = this;
		var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");

		if(direccion != null){
			if(direccion == "anterior"){
				var numBeatAnterior = idNumBeat*1-1;
				
				if(numBeatAnterior < 1){
				numBeatAnterior = that.totalBeats;
				}
	
				var valueBeatAnterior = $("#"+numBeatAnterior).attr("value");
				// var partesClaseBeatAnterior = valueBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
        var idBeatAnterior = valueBeatAnterior;
        this.beatSeleccionado = idBeatAnterior;
				that.getBeat(idBeatAnterior, true);
	
	
			} else if(direccion == "siguiente"){
				var numBeatSiguiente = idNumBeat*1+1;
	
				if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
				}
	
				var valueBeatSiguiente = $("#"+numBeatSiguiente).attr("value");
				// var partesClaseBeatSiguiente = valueBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)
	
        var idBeatSiguiente = valueBeatSiguiente;
        this.beatSeleccionado = idBeatSiguiente;
	
				that.getBeat(idBeatSiguiente, true);
			}
		}
		

    }
    
    cambiarBeatAlFinalizar(){
		var audio = (<any>document.getElementById("audio-reproductor-con-listado"));
		var that = this;

		audio.onended = function(){
			var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");

			var numBeatSiguiente = idNumBeat*1+1;
		
			if(numBeatSiguiente > that.totalBeats){
				numBeatSiguiente = 1;
			}

			var valueBeatSiguiente = $("#"+numBeatSiguiente).attr("value");
			// var partesClaseBeatSiguiente = valueBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

			var idBeatSiguiente = valueBeatSiguiente;

			if(that.beatEnBucle == false){
				that.getBeat(idBeatSiguiente, true);
			} else {
				that.getBeat(that.beat._id, true);
			}
		};
    }
      
    cargarSocket(){
		var that = this;
	
		this.socket.on('beat', function(beat, totalReproducciones){
			GLOBAL.DEBUG && console.log(beat);
			this.totalReproducciones = totalReproducciones;

			that.render(beat);
			this.beat = beat;
			GLOBAL.DEBUG && console.log(this.beat);
			GLOBAL.DEBUG && console.log(this.totalReproducciones);
		});
	}  
	
	render(beat){
		let reproduccionesBeat = beat.reproducciones;

		if(beat){
			var elementoReproducciones = document.querySelector("#reproducciones-beat-"+beat._id);

			if(elementoReproducciones != null) elementoReproducciones.innerHTML = reproduccionesBeat + `<i class="fa fa-play"></i>`;
		}
	}
    
    sumaReproduccion(){
		var that = this;
		this.socket.emit('sumar-reproduccion', this.beat, this.beat.autor);
		
		return false;
	}

    

    getBeatsUsuario(nick){
		this._beatService.getBeatsUsuario(nick).subscribe(
			response => {
				if(response.beats){
            this.beatsUsuario = response.beats;

            var limite = 4;
            
            this.beatsUsuario.splice(limite,this.beatsUsuario.length)
            GLOBAL.DEBUG && console.log(this.beatsUsuario);					
					
				}else{
					this.status = 'error';
				}
			},
			error => {
				var mensajeError = <any>error;
				GLOBAL.DEBUG && console.log(mensajeError);

				if(mensajeError != null){
					this.status = 'error';
				}
			}
        );
	}
   

}