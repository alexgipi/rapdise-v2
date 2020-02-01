import { Component, OnInit, EventEmitter,Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Lista } from '../../../models/lista';

import Swal  from 'sweetalert2';

import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { ListaService } from '../../../services/lista.service';
import { UploadService } from '../../../services/upload.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'modal-editar-lista',
  templateUrl: './modal-editar-lista.component.html',
  providers: [UserService, BeatService, ListaService, UploadService]
})

export class ModalEditarListaComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	public beat: Beat;
    public beats: Beat[];

	@Input() listaAEditar: Lista;

	public urlAudioBeat: null;
	public duracionAudioBeat;
    public urlImagenBeat: null;
    
    public lista: Lista;
	public listas: Lista[];

	public beatsLista;

	public sonando = false;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
        private _beatService: BeatService,
        private _listaService: ListaService,
		private _uploadService: UploadService,
		private domSanitizer: DomSanitizer

	){
		this.titulo = 'Modal crear lista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
        // this.lista.beats = new Array;
		
	}
	ngOnInit(){
		console.log('Componente modal-crear-lista cargado!');
        this.getBeatsUsuario();
		this.getBeatsEstilo("todos");
		this.beatsLista = this.listaAEditar.beats;
		
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

	getBeatsLista(){
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
    
    public mostrandoBeats = "mis-beats";
    mostrarMisBeats(){
        this.getBeatsUsuario();
        this.mostrandoBeats = "mis-beats";
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

	borrarLista(lista){
		Swal({
			title: '¿Estas seguro?',
			text: 'Eliminar '+lista.nombre+ ' de esta lista',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si, estoy seguro!',
			cancelButtonText: 'No, espera!'			  
		}).then((result) => {
			if (result.value) {
				Swal('Lista borrada con exito','','success');
				
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				Swal(
					'Cancelado',
					'La lista sigue a salvo!',
					'error'
				);
			}
		});		
	}

	//Output
	@Output() sended = new EventEmitter();

	sendLista(event){
		console.log(event);
		this.sended.emit({send: 'true'});
	}

}
