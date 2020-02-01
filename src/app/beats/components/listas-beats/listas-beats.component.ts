import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { HostListener} from "@angular/core";

import Swal  from 'sweetalert2';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { LikeBeat } from '../../../models/like-beat';

import { Lista } from '../../../models/lista'

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { LikeBeatService } from '../../../services/like-beat.service';

import { ListaService } from '../../../services/lista.service';


import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'listas-beats',
  templateUrl: './listas-beats.component.html',
  providers: [UserService, ListaService, BeatService, LikeBeatService]
})

export class ListasBeatsComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	
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

	// beats
	public beats: Beat[];
	public totalBeats;

	public beat;
	public primerBeat;
	public beatSeleccionado;
	public idBeat1;

	public beatEnBucle: boolean = false;
	public sonando = false;
	
	// likes(reputaciond) de beats
	public likes;
	public totalLikes;

	public modalCrearListaAbierto = false;
	public modalEditarListaAbierto = false;

	public listaAEditar: Lista;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _listaService: ListaService,
		private _beatService: BeatService,
		private _likeBeatService: LikeBeatService,

	){
		this.titulo = 'Listas de beats';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		
	}

	public filtroSeleccionado;

	descargar(beat){

	}

	pauseBeat(){

	}

	activarDesactivarDropdown(filtro){

	}

	recibirBeat(event){

	}
	

	ngOnInit(){
		console.log('Componente de listas de beats cargado!');
		this.controlarAnchuraVentana('init');
		// this.contadorLikesBeat("5b205e128d6a5b24e0bff157");
		this.getBeats();
		this.getListas();
		// this.modalCrearListaAbierto = true;

		$(".footer").css("display", "none");

		$(".mi-hamburguesa").addClass("display-none");

		var that = this;
		setTimeout( function(){
		that.cambiarBeatAlFinalizar();
		}, 1000 );
		
	}

	public anchuraVentana;
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.controlarAnchuraVentana('resize');

		
	}
	
	controlarAnchuraVentana(evento){
		this.anchuraVentana = window.innerWidth;

		if(evento == 'resize'){
			if(this.anchuraVentana <= 769){
				var that = this;
				this.verReproductorMovil = true;
				// setTimeout(function(){
				// 	that.getBeat(that.beat._id, true);
				// }, 500);
				
			} else {
				this.verReproductorMovil = false;

			}
		} else if( evento == 'init') {

			if(this.anchuraVentana <= 769){
				this.verReproductorMovil = true;
				
			} else {
				this.verReproductorMovil = false;
			}			
		}
		

		
	}

	getListas(){
		this._listaService.getListas().subscribe(
			response => {
				if(response.listas){
					this.listas = response.listas;
					this.totalListas = this.listas.length;

					this.primeraLista = this.listas['0'];
          			this.listaSeleccionada = this.primeraLista;
					this.idLista1 = this.primeraLista._id;

					this.getLista(this.idLista1, true, true); // Iniciar reproductor al cargar la primera lista

					console.log(this.listas);
					console.log(this.totalListas);

					console.log(this.listaSeleccionada);
					console.log(this.idLista1);
				} else{
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
		)
	}

	getLista(idLista, getBeat = true, iniciarReproductor = false){
		this._listaService.getLista(idLista).subscribe(
			response => {
				if(response.lista){
					this.lista = response.lista;
					this.listaAEditar = this.lista;

					this.beatsLista = this.lista.beats;
					this.totalBeatsLista = this.lista.beats.length;
					console.log(this.lista);
					console.log("Total beats lista: " + this.totalBeatsLista);
					console.log(this.beatsLista);

					this.primerBeat = this.beatsLista['0'];
          			this.beatSeleccionado = this.primerBeat;
					this.idBeat1 = this.primerBeat.beat._id;

					this.getEstilosLista();

					if(getBeat == true){
						if (iniciarReproductor == true) {
							this.getBeat(this.idBeat1, true);
						} else {
							this.getBeat(this.idBeat1);
						}
					}

				} else{
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
		)
	}

	selecionarLista(lista){
		this.lista = lista;
		this.idLista1 = this.lista._id;
		this.getLista(this.idLista1, true, true);
		this.abrirCerrarListaActiva();	
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
				if(response){
					
					this.likes = response.beats_me_gustan;
					if(this.likes) this.totalLikes = this.likes.length;
					
					this.ajustarReproductorAPantalla();
					

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

	getReproductorSonando(event):void{
		this.sonando = event.sonando;
	}

	getBeat(id, iniciarReproductor = false, event = false) {
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
				}
			  }, 300);
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


	
	
	formatearTiempo(seconds) {
		var minutes = (<any> Math.floor(seconds / 60));
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;

		$("#tiempo-actual-beat-seleccionado").html(minutes + ":" + seconds);
	}

	
	playReproductor() {
		(document.getElementById("audio-reproductor-general") as any).play();
		this.sonando = true;
	}

	pauseReproductor() {
		(document.getElementById("audio-reproductor-general") as any).pause();
		this.sonando = false;
	}


	selecionarBeat(beat){
		this.beat = beat;
    	this.idBeat1 = this.beat._id;

	
		var beat_selecionado = JSON.stringify(beat);
		localStorage.setItem('beat_seleccionado', beat_selecionado);
	}

	public likeBeatOver;
	mouseEnter(beat_id){
		this.likeBeatOver = beat_id;
	}

	mouseLeave(beat_id){
		this.likeBeatOver = 0;
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
	
	cambiarBeatAlFinalizar(){
    var audio = (<any>document.getElementById("audio-reproductor-general"));
    var that = this;

    audio.onended = function(){
	  var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");
	  
	  

	  var numBeatSiguiente = idNumBeat*1+1;
      
      if(numBeatSiguiente > that.totalBeatsLista){
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

	// activarDesactivarBeatEnBucle(){
	// 	if(this.beatEnBucle == false){
	// 		this.beatEnBucle = true;
	// 		$(".btn-bucle-rep-general").addClass("activo");
	// 	}else if(this.beatEnBucle == true){
	// 		this.beatEnBucle = false;
	// 		$(".btn-bucle-rep-general").removeClass("activo");
	// 	}            
	// }

	// cambiarBeat(direccion){
	// 	var that = this;
	// 	var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");

		
	// 	if(direccion == "anterior"){
	// 		var numBeatAnterior = idNumBeat*1-1;
			
	// 		if(numBeatAnterior < 1){
	// 		numBeatAnterior = that.totalBeatsLista;
	// 		}

	// 		var claseBeatAnterior = $("#"+numBeatAnterior).attr("class");
	// 		var partesClaseBeatAnterior = claseBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

	// 		var idBeatAnterior = partesClaseBeatAnterior[2];

	// 		that.getBeat(idBeatAnterior, true);


	// 	} else if(direccion == "siguiente"){
	// 		var numBeatSiguiente = idNumBeat*1+1;

	// 		if(numBeatSiguiente > that.totalBeatsLista){
	// 		numBeatSiguiente = 1;
	// 		}

	// 		var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
	// 		var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

	// 		var idBeatSiguiente = partesClaseBeatSiguiente[2];

	// 		that.getBeat(idBeatSiguiente, true);
	// 	}

	// }


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


	ajustarReproductorAPantalla(){
		var anchuraReproductor = $(".reproductor-biblio").outerWidth();

		$(".imagen-beat-seleccionado-biblio").css("height", anchuraReproductor + "px")
	}

	refresh(event = null){
		this.getBeats();
	}

	abrirModal(tipoModal, lista = null){
		if(tipoModal == 'crear-lista'){
			this.modalCrearListaAbierto = true;
		} else if(tipoModal == 'editar-lista'){
			if(lista){
				this.listaAEditar = lista;
				console.log(this.listaAEditar);
				this.modalEditarListaAbierto = true;
			}
		}
		
	}

	cerrarModal(tipoModal){
		if(tipoModal == 'crear-lista'){
			this.modalCrearListaAbierto = false;
		} else if(tipoModal == 'editar-lista'){
			this.modalEditarListaAbierto = false;
		}
	}

	borrarLista(lista){
		Swal({
			title: '¿Estas seguro?',
			text: 'Lista: '+lista.nombre,
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Destruir lista',
			cancelButtonText: 'No, espera!'			  
		}).then((result) => {
			if (result.value) {
				Swal('Lista destruida con exito','','success');

				this._listaService.borrarLista(this.token, lista._id).subscribe(
					response => {
						if(response){
							console.log("lista eliminada");
							this.getListas();
						} else {
							console.log("error al eliminar la lista");
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
				
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				Swal(
					'Cancelado',
					'Tu lista sigue a salvo!',
					'error'
				);
			}
		});		
	}

	getEstilosLista(){

		this.estilosLista = new Array();

		this.beatsLista.forEach((beatLista, index) => {
			let estilo = beatLista.beat.style;

			if(this.estilosLista.indexOf(estilo) < 0) {
				this.estilosLista.push(estilo);
			}	
		});

		console.log(this.estilosLista);
	}

	refrescar(event = false){
		this.getListas();
		this.cerrarModal('crear-lista');
		this.cerrarModal('editar-lista');
	}






	elegirMostrarEnBiblioteca(){
		
        if(this.listaAEditar.enBiblioteca == 'NO'){
            this.listaAEditar.enBiblioteca = 'SI';
        } else {
            this.listaAEditar.enBiblioteca = 'NO';
        }

	}

	editarLista(form){
		this._listaService.editarLista(this.token, this.listaAEditar._id, this.listaAEditar).subscribe(
			response => {
				if(response.lista){
					this.status = 'success';
					console.log(response.lista);
					this.refrescar();
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
		)
	}

	crearLista(form){
		console.log(this.lista);

		this._listaService.crearLista(this.token, this.lista).subscribe(
			response => {
				if(response.lista){
                    this.status = 'success';
					
                    form.reset({ tipo: '', estado: '' });
					this.elegirMostrarEnBiblioteca();
					this.lista.beats.splice(0);
					$(".item-listado-beats-crear-lista").removeClass("activo");
					$(".btn-beat-lista-add img").removeClass("display-none");
					$(".btn-beat-lista-add i").addClass("display-none");
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



	getBeatsUsuario(){
		this._beatService.getBeatsUsuario(this.identity.nick).subscribe(
			response => {
				if(response.beats){
					this.beats = response.beats;
					console.log(this.beats);
				} else {
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
		)
    }
    
    getBeatsEstilo(estilo){
		this._beatService.getBeatsEstilo(estilo,this.identity._id).subscribe(
			response => {
				if(response.beats){
					this.beats = response.beats;
					console.log(this.beats);
				} else {
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
		)
    }
    
    public mostrandoBeats = "beats-lista";
    mostrarBeatsLista(){
        this.getBeatsUsuario();
        this.mostrandoBeats = "beats-lista";
    }

    mostrarTodosLosBeats(){
        this.getBeatsEstilo("todos");
        this.mostrandoBeats = "todos";
    }

    pushBeatLista(beat){
		var idBeat = beat._id;

        this.lista.beats.push({
            beat: idBeat,
		});

		$("#beat-"+idBeat).addClass("activo");

		$("#btn-beat-lista-add-"+idBeat+" img").addClass("display-none");
		$("#btn-beat-lista-add-"+idBeat+" i").removeClass("display-none");
		
        console.log(this.lista.beats);
	}
	
	quitarBeatLista(beat){
		Swal({
			title: '¿Estas seguro?',
			text: 'Eliminar '+beat.beat.name+ ' de esta lista',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si, estoy seguro!',
			cancelButtonText: 'No, espera!'			  
		}).then((result) => {
			if (result.value) {
				Swal('Beat borrado de la lista','','success');
				var idBeat = beat._id;
				const index = this.listaAEditar.beats.findIndex(beat => beat._id === idBeat);

				this.listaAEditar.beats.splice(index, 1);
				this.beatsLista = this.listaAEditar.beats;
				
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				Swal(
					'Cancelado',
					'Este beat sigue en tu lista',
					'error'
				);
			}
		});
		
		
	}

	public verReproductorMovil = false;

	public listaActivaAbierta = false;
	abrirCerrarListaActiva(){
		if(this.listaActivaAbierta){
			this.listaActivaAbierta = false;
			
			$(".panel-lista-seleccionada").removeClass("activo");
			$(".panel-beats-biblioteca .col-xl-6").removeClass("fijo");
		} else {
			this.listaActivaAbierta = true;
			
			$(".panel-lista-seleccionada").addClass("activo");
			$(".panel-beats-biblioteca .col-xl-6").addClass("fijo");
		}
	}

	
	
}
