import { Component, OnInit, EventEmitter, Input, Output,  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import {saveAs} from 'file-saver';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Follow } from '../../../models/follow';
import { Lista } from '../../../models/lista';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { FollowService } from '../../../services/follow.service';
import { ListaService } from '../../../services/lista.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'reproductor-biblioteca',
  templateUrl: './reproductor-biblioteca.component.html',
  providers: [UserService, BeatService, FollowService, ListaService]
})

export class ReproductorBibliotecaComponent implements OnInit, OnChanges {
    // Decorador Output
    @Output() PasameElBeat = new EventEmitter();

    @Output() PasameBeatEnBucle = new EventEmitter();
    @Output() DireccionCambioBeat = new EventEmitter();


    @Input() beat;
    @Output() ReproductorSonando = new EventEmitter();

    public sonando = true;
    

    public identity;
    public token;
    public url;
    public status;
    public beats: Beat[];
    public totalBeats;

    public beatAleatorio: boolean = false;
    public beatEnBucle: boolean = false;
    

    public primerBeat;
    public beatSeleccionado;
    public idBeat1;

    public filtroBeat = "";

    public beatsUsuario: Beat[];

    public lista: Lista;
	public listasUsuario: Lista[];
    public totalListasUsuario;
    
    constructor(
        private _userService: UserService,
        private _beatService: BeatService,
        private _followService: FollowService,
        private _listaService: ListaService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

        if(this.identity) this.follow = new Follow("",this.identity._id, "");

        if(this.identity){
			this.lista = new Lista("", "","lista_general","","publica", "NO", "", "", this.identity._id, "" , "", "");
		} else {
			this.lista = new Lista("", "","lista_general","","publica", "NO", "", "", "", "" , "", "");
		}
		
		this.lista.beats = new Array;
    }
    ngOnChanges(changes: SimpleChanges) {
        
  
            const beat: SimpleChange = changes.beat;

            if(beat){
                GLOBAL.DEBUG && console.log(beat);
                
                if(beat.currentValue){
                    this.beat = beat.currentValue;
                    this.getBeatsUsuario(this.beat.user.nick);
                    if(this.identity)this.usuariosQueSigo();
                }
            }
            
            
        
    }
    ngOnInit() {
        GLOBAL.DEBUG && console.log('Reproductor cargado');
        
        var that = this;
        setTimeout( function(){
        that.reproductorBeat();
        that.getBeatsUsuario(that.beat.user.nick)
        }, 1000 );

        // Eventos teclado
        // $(document).keydown(function(e) {
        //     switch(e.which) {
        //         case 37: // left
        //         that.cambiarBeat('anterior');
        //         break;
    
        //         case 39: // right
        //         that.cambiarBeat('siguiente');
        //         break;
    
        //         default: return;
        //     }
        //     e.preventDefault();
        // });

        
    }


    reproductorBeat() {
        var audio = (<any>document.getElementById("audio-reproductor-general"));
        var that = this;

        audio.ontimeupdate = function () {
        var percentage = (audio.currentTime / audio.duration) * 100;
        $(".mi-barra-tiempo-actual").css("width", percentage + "%");

        that.formatearTiempo(audio.currentTime, $("#tiempo-actual-beat-rep-general"));
        
        };

        audio.onplaying = function () {
            that.sonando = true;
            that.ReproductorSonando.emit({sonando: that.sonando});
        }

        audio.onpause = function () {
            that.sonando = false;
            that.ReproductorSonando.emit({sonando: that.sonando});
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
        (document.getElementById("audio-reproductor-general") as any).play();
        this.sonando = true;
        this.ReproductorSonando.emit({sonando: this.sonando});
    }

    pauseReproductor() {
		(document.getElementById("audio-reproductor-general") as any).pause();
	}
	
	playPauseReproductor(){
		if(this.sonando) {
			this.pauseReproductor();
		}else {
			this.playReproductor();
		}
	}


    activarDesactivarBeatEnBucle(accion = null){
        if (!accion){
            if(this.beatEnBucle == false){
                this.beatEnBucle = true;
                $(".btn-bucle-player").addClass("activo");
                this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
                if(this.beatAleatorio){
                    this.activarDesactivarBeatAleatorio('desactivar');
                }  
            }else if(this.beatEnBucle == true){
                this.beatEnBucle = false;
                $(".btn-bucle-player").removeClass("activo");
                this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
            }
        } else if (accion == 'activar'){
            this.beatEnBucle = true;
            $(".btn-bucle-player").addClass("activo");
            this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
        } else if (accion == 'desactivar'){
            this.beatEnBucle = false;
            $(".btn-bucle-player").removeClass("activo");
            this.PasameBeatEnBucle.emit({beatEnBucle: this.beatEnBucle});
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

    cambiarBeat(direccion){
        this.DireccionCambioBeat.emit({direccion: direccion});
    }


    getBeat(idBeat, iniciarReproductor) {
        this.PasameElBeat.emit({idBeat:idBeat,iniciarReproductor: iniciarReproductor});
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
    

    descargar(nombreArchivo){

        this._beatService.descargarBeat(nombreArchivo).subscribe(
            response => saveAs(response, nombreArchivo),
            error => console.error(error)
        );

    }





    // SEGUIR USUARIO (PRODUCTOR) 

    public follows;
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
		)
	}

	public siguiendo = false;

	comprobarSeguimientoUsuario(){

		if(this.beat.user && this.idsUsuariosQueSigo && this.idsUsuariosQueSigo.indexOf(this.beat.user._id) >= 0){
			this.siguiendo = true;
		} else if(this.beat.user && this.idsUsuariosQueSigo && this.idsUsuariosQueSigo.indexOf(this.beat.user._id) < 0){
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
		)
	}

	dejarDeSeguirUsuario(idUsuario){
		this._followService.deleteFollow(this.token, idUsuario).subscribe(
			response => {
				if(response){
					GLOBAL.DEBUG && console.log(response.message)
					this.siguiendo = false;

				} else {
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
		)
    }
    



    // Listas

	crearLista(form){
		console.log(this.lista);

		this._listaService.crearLista(this.token, this.lista).subscribe(
			response => {
				if(response.lista){
                    this.status = 'success';
					
					form.reset({ tipo: 'lista_general', estado: 'publica' });
					
					this.lista.beats.splice(0);
					$(".item-listado-beats-crear-lista").removeClass("activo");
					$(".btn-beat-lista-add img").removeClass("display-none");
					$(".btn-beat-lista-add i").addClass("display-none");

					this.misListas();

					this.incluirBeatEnLista(this.beat._id,response.lista._id);
					this.seleccionarDeseleccionarLista(response.lista)
				}else {
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

	misListas(){
		if(this.identity){		
			this._listaService.getListasUsuario(this.identity.nick).subscribe(
				response => {
					if(response.listas){
						this.listasUsuario = response.listas;
						this.totalListasUsuario = response.total;
						console.log(this.listasUsuario);
						console.log(this.totalListasUsuario);

						this.listasUsuario.forEach((listaUsuario, index) => {
							this.comprobarBeatEnLista(this.beat._id, listaUsuario._id);
						});
						
					}else{
						this.status = 'error';
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
		} else {
			// no login, inicia sesion para...
		}
	}

	comprobarBeatEnLista(idBeat,idLista){
		this._listaService.comprobarBeatEnLista(idBeat, idLista).subscribe(
			response => {
				if(response){
					if(response.estaEnLaLista == true) {
						console.log("El beat "+idBeat + " SI está en la lista: "+ idLista);
						$("#lista-"+idLista+ " .mi-checkbox").addClass("mi-checked");
					} else {
						console.log("El beat "+idBeat + " NO esta en la lista: "+ idLista);
					}
				}else {
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null) {
					this.status = 'error';
				}
			}
		)
	}


	abrirFormCrearLista(){
		$(".guardar-beat-lista").addClass("crear-lista");
	}

	seleccionarDeseleccionarLista(lista){

		var mi_checkbox = $("li[title=\""+lista.nombre+"\"] .mi-checkbox");

		if( $(mi_checkbox).hasClass("mi-checked") == true){ // Eliminar beat de la lista Si existe la clase mi-checked 

			mi_checkbox.removeClass("mi-checked");	
			this.notificacionToast("retirado", lista.nombre);

			this.borrarBeatDeLista(lista._id,this.beat._id);

		} else { // Sinó, añadir beat a lista 
			mi_checkbox.addClass("mi-checked");	
			this.notificacionToast("anadido", lista.nombre);

			this.incluirBeatEnLista(this.beat._id,lista._id);
		}			
	}

	public tiempoToast;
	notificacionToast(accion, nombreLista){
		
		$(".zona-mi-toast").empty();
		clearTimeout(this.tiempoToast);

		var that = this;

		if(accion == "anadido"){
			
			$(".zona-mi-toast").append(`
				<div class="mi-toast toast-anadido">
					<span class="mi-toast-nombre-accion">
						Añadido a <i>${nombreLista}</i>
					</span>
					<span class="mi-toast-deshacer" (click)="notificacionToast('retirado')">Deshacer</span>
				</div>
			`);
			
			requestAnimationFrame(function () {
				$(".toast-anadido").addClass("toast-visible");
				
				that.tiempoToast = setTimeout(function(){
					$(".toast-anadido").removeClass("toast-visible");
				}, 4000);
			});
			
		} else if( accion == "retirado") {
			$(".zona-mi-toast").append(`
				<div class="mi-toast toast-retirado">
					<span class="mi-toast-nombre-accion">
						Beat retirado de <i>${nombreLista}</i>
					</span>
					<span class="mi-toast-deshacer" (click)="notificacionToast('anadido')">Deshacer</span>
				</div>
			`);
			
			requestAnimationFrame(function () {
				$(".toast-retirado").addClass("toast-visible");
				
				that.tiempoToast = setTimeout(function(){
					$(".toast-retirado").removeClass("toast-visible");
				}, 4000);
			});
		}

				
	}



	incluirBeatEnLista(idBeat,idLista){
		this._listaService.incluirBeatEnLista(idBeat,idLista).subscribe(
			response => {
				if(response.lista){
					console.log(response.lista);
				}else {
					this.status = 'error';
				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
		
				if (errorMessage != null) {
				this.status = 'error';
				}
			}
		)
	}

	borrarBeatDeLista(idLista,idBeat){
		this._listaService.borrarBeatDeLista(idLista,idBeat).subscribe(
			response => {
				if(response.lista){
					console.log(response.lista);
				}else {
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null) {
					this.status = 'error';
				}
			}
		)
	}


	abrirCerrarModalAddLista(){
		if( $(".modal-guardar-beat-lista").hasClass("modal-abierto") == true ){
			$(".modal-guardar-beat-lista").removeClass("modal-abierto");

			$(".guardar-beat-lista").removeClass("crear-lista");
		} else {
			$(".modal-guardar-beat-lista").addClass("modal-abierto");
			this.misListas();
		}
		
	}
    
   

}