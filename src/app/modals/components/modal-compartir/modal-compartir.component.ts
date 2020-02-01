import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';

import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { UploadService } from '../../../services/upload.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'modal-compartir',
  templateUrl: './modal-compartir.component.html',
  styleUrls:  ['./style.css'],
  providers: [UserService, BeatService, UploadService]
})

export class ModalCompartirComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	public beats: Beat[];

	@Input() beatAEditar: Beat;
	modalAbierto: boolean = false;

	@Output() CerrarModal = new EventEmitter();

	public urlImagenBeat;
	public duracionAudioBeat;
	public urlAudioBeat;
	public rutaActual;

	public cerrarModal: boolean = false;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _uploadService: UploadService,
		private domSanitizer: DomSanitizer

	){
		this.titulo = 'Editar beat';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		
	}

	ngOnDestroy(){
		$(".footer").removeClass("display-none");		
	}
	ngOnInit(){
		console.log('Componente BeatEdit cargado!');

		$(".footer").addClass("display-none");

		$("input:text").focus(function() { $(this).select(); } );
		console.log(this._router.url)
		this.rutaActual = this._router.url;
	}

	abrirCerrarModal(){
		if(this.modalAbierto == false){
			this.modalAbierto = true;
		}else {
			this.modalAbierto = false;
		}
	}

	
}
