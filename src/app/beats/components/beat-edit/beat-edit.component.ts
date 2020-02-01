import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges , SimpleChanges , SimpleChange } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Etiqueta } from '../../../models/etiqueta';

import {TranslateService} from '@ngx-translate/core';
import {FormControl} from '@angular/forms';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { UploadService } from '../../../services/upload.service';
import { EtiquetaService } from '../../../services/etiqueta.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'beat-edit',
  templateUrl: './beat-edit.component.html',
  providers: [UserService, BeatService, UploadService, EtiquetaService]
})

export class BeatEditComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	public beats: Beat[];

	public beatAEditar: Beat;
	@Input() modalAbierto: boolean;

	@Output() CerrarModal = new EventEmitter();

	public urlImagenBeat;
	public duracionAudioBeat;
	public urlAudioBeat;

	estiloBeat = new FormControl();
	estilosDisponibles: string[] = ['Old School', 'Trap', 'Underground', 'Boom Bap', 'Jazzy', 'Lofi', 'Reggae', 'Dancehall', 'Indie'];

	public etiqueta: Etiqueta;
	public etiquetas: Etiqueta[];

	public cerrarModal: boolean = false;

	imageChangedEvent: any = '';
	imagenRecortada: any = '';
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _uploadService: UploadService,
		private _etiquetaService: EtiquetaService,
		private domSanitizer: DomSanitizer

	){
		this.titulo = 'Editar beat';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.etiqueta = new Etiqueta("", "beat","");
		
	}

	ngOnDestroy(){
		$(".footer").removeClass("display-none");		
	}
	ngOnInit(){
		console.log('Componente BeatEdit cargado!');

		$(".footer").addClass("display-none");
		this.cargarPagina();
	}

	cargarPagina(){
		this._route.params.subscribe(params => {
			var idBeat = params['idBeat'];

			this.getBeat(idBeat);

			this.audioEditado = false;
			this.urlImagenBeat = null;
			this.imagenRecortada = null;
		});
	}

	getBeat(idBeat){
		this._beatService.getBeat(idBeat).subscribe(
			response => {
				if(response.beat){
					this.beatAEditar = response.beat;
				}
			},
			error => {

			}
		)
	}

	ngOnChanges(changes: SimpleChanges) {
		// const currentItem: SimpleChange = changes.tipoCaratula;
	
		// if(currentItem.currentValue == 'imagen'){
		//   console.log('got item: ', currentItem.currentValue);
		// }
	
		if (this.beatAEditar && changes.beatAEditar) {
		  if (changes.beatAEditar.currentValue != changes.beatAEditar.previousValue ){
			console.log('value changed to ' + this.beatAEditar.name + " - " + this.beatAEditar._id)
			this.beatAEditar = this.beatAEditar;			
		  }
		}
	}

	especificarUsos(uso){
		if(uso == 'libre'){
			this.beatAEditar.permitirBatalla = true;
			this.beatAEditar.permitirGrabacion = true;
			this.beatAEditar.permitirEntreno = true;
		} else {
			this.beatAEditar.permitirBatalla = false;
			this.beatAEditar.permitirGrabacion = false;
			this.beatAEditar.permitirEntreno = false;
		}
	}

	editarPermiso(permiso){

		if(permiso == 'batalla'){
			if(this.beatAEditar.permitirBatalla == false){
				this.beatAEditar.permitirBatalla = true;
			} else {
				this.beatAEditar.permitirBatalla = false;
			}
		} else if (permiso == 'grabacion') {
			if(this.beatAEditar.permitirGrabacion == false){
				this.beatAEditar.permitirGrabacion = true;
			} else {
				this.beatAEditar.permitirGrabacion = false;
			}
		} else if (permiso == 'entreno'){
			if(this.beatAEditar.permitirEntreno == false){
				this.beatAEditar.permitirEntreno = true;
			} else {
				this.beatAEditar.permitirEntreno = false;
			}
		}
	}

	changed() {
		// if (this.estiloBeat.value.length < 4) {
		// 	this.mySelections = this.estiloBeat.value;
		// 	this.beat.style = this.estiloBeat.value;
		// 	console.log(this.beat)
		// } else {
		// 	this.estiloBeat.setValue(this.mySelections);
		// }	
	}

	editarBeat(){
		this._beatService.editarBeat(this.token, this.beatAEditar._id, this.beatAEditar).subscribe(
			response => {
				if(response.beat){
					this.status = 'beat editado';
					alert("beat-editado");

					if(this.audiosASubir){
						//Subir fichero de audio
						this._uploadService.makeFileRequest(this.url+'guardar-archivo-beat/'+this.beatAEditar._id, [], this.audiosASubir, this.token, 'file')
						.then((result: any) => {
							this.beatAEditar.file = result.beat.file;
							alert(this.beatAEditar.file)
							this.cerrarModalEditar();
						});
					}

					if(this.imagenesASubir){						

						//Subir fichero de imagen
						this._uploadService.makeFileRequest(this.url+'subir-imagen-beat/'+this.beatAEditar._id, [], this.imagenesASubir, this.token, 'image')
						.then((result: any) => {
							this.beatAEditar.image = result.beat.image;
							this.cerrarModalEditar();
						});
					}

				}else {
					this.status = 'error al editar beat';
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

	cerrarModalEditar(){ // Redireccion al cerrar modal de edicion de beat
		this.CerrarModal.emit({cerrarModal: true});
	}

	public audiosASubir: Array<File>;
	public audioEditado: boolean = false;
	audioFileChange(fileInput: any){
		this.audioEditado = true;
		this.audiosASubir = <Array<File>>fileInput.target.files;
		console.log(this.audiosASubir);

		var nombreAudio = this.audiosASubir[0].name;
		console.log(nombreAudio); //nombreAudio.mp3

		var reg = /(?:\.([^.]+))?$/;

		var extensionAudio = reg.exec(nombreAudio)[1];   // "mp3"

		if(extensionAudio == "mp3"){
			var reader = new FileReader() as any;
			reader.readAsDataURL(fileInput.target.files[0]); // read file as data url
	
			reader.onload = (fileInput) => { // called once readAsDataURL is completed
				this.urlAudioBeat = (<any>this.domSanitizer.bypassSecurityTrustResourceUrl(fileInput.target.result));
				
				
				var that = this;

				setTimeout(function(){
					var audio = (<any>document.getElementById("audio-subir-beat"));	
					formatearTiempo(audio.duration);
					
					function formatearTiempo(seconds) {
						var minutes = (<any> Math.floor(seconds / 60));
						minutes = (minutes >= 10) ? minutes : "0" + minutes;
						seconds = Math.floor(seconds % 60);
						seconds = (seconds >= 10) ? seconds : "0" + seconds;
					
						that.duracionAudioBeat = minutes + ":" + seconds;
						that.beatAEditar.duration = that.duracionAudioBeat;
					}
				}, 1200);
			}
		} else {
			alert("Debes subir un archivo de audio mp3");
		}

		
		
	}

	

	public imagenEditada: boolean = false;
	public imagenesASubir: Array<File>;
	imagenFileChange(fileInput: any):void{
		this.imagenesASubir = <Array<File>>fileInput.target.files;
		var _URL = window.URL;
		this.imageChangedEvent = fileInput;
		console.log(fileInput)	

		var file = fileInput.target.files[0];
		console.log(file);

		var img = new Image();
		var imgwidth = 0;
		var imgheight = 0;
		var maxwidth = 640;
		var maxheight = 640;

		img.src = _URL.createObjectURL(file);

		img.onload = function():any {

				console.log(img.width + " x " + img.height)
			 
		}

		

		var reader = new FileReader() as any;

		reader.readAsDataURL(fileInput.target.files[0]); // read file as data url
  
		reader.onload = (fileInput) => { // called once readAsDataURL is completed
		  this.urlImagenBeat = (<any>this.domSanitizer.bypassSecurityTrustResourceUrl(fileInput.target.result));
		  console.log(this.urlImagenBeat);
		}
	}

	// ETIQUETAS

	addEtiqueta(etiqueta){
		var valor = etiqueta.valor;

		this._etiquetaService.addEtiqueta(this.token, {tipo:"beat",valor:valor}).subscribe(
			response => {
				if(response.etiqueta){

					this.beatAEditar.etiquetas.pop();
					
					this.beatAEditar.etiquetas.push({
						_id: response.etiqueta._id,
						tipo: 'beat',
						valor: valor
					});

					console.log(this.beatAEditar.etiquetas);
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.status = 'error';
				}
			}
		);
	}


	quitarEtiqueta(event){
		this.etiqueta.valor = event.valor;

		console.log(this.beatAEditar.etiquetas)
		console.log(this.etiqueta.valor)

	

		// const index = this.beatAEditar.etiquetas.findIndex(etiqueta => etiqueta.valor === this.etiqueta.valor); 
	
		// this.beatAEditar.etiquetas.splice(index, 1);
		console.log(this.beatAEditar.etiquetas)
	}

	public onAdding(etiqueta): Observable<string> {
		etiqueta = '#'.concat(etiqueta.replace(/#|_|-/g,'').replace(/\s/g, ''));
        return Observable
            .of(etiqueta);
    }

	getEtiqueta(idEtiqueta){
		this._etiquetaService.getEtiqueta(idEtiqueta).subscribe(
			response => {
				if(response.etiqueta){
					console.log(response.etiqueta)
					// return response.etiqueta;
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.status = 'error';
				}
			}
		)
	}


	recibirTipoCaratula(event):void{
		alert(event.tipoCaratula);
		var tipoCaratula = event.tipoCaratulaM

		
	}

	recibirAjustesCaratula(event):void{
		
		this.beatAEditar.ajustesCaratula = event.ajustesCaratula;
		console.log(this.beatAEditar.ajustesCaratula);
	}

	abrirInputFileBeat(){
		$("#subir-audio-beat").click();
	}

	abrirInputFileImagen(){
		$("#subir-imagen-beat").click();
	}


	// RECORTAR IMAGEN SUBIDA

    imageCropped(event: ImageCroppedEvent) {
		console.log(event);
		this.imagenRecortada = event.base64;

		console.log(this.imagenesASubir);
		
    }
    imageLoaded() {
		// show cropper
		this.abrirCerrarModalAddImagen();
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
		// show message
		alert("Formato de archivo no compatible")
	}

	public modalAddImagenAbierto = false;
	
	abrirCerrarModalAddImagen(){
		if(this.modalAddImagenAbierto == false){
			this.modalAddImagenAbierto = true;
			console.log("modal abierto = " + this.modalAddImagenAbierto);
		}else {
			this.modalAddImagenAbierto = false;
			console.log("modal abierto = " + this.modalAddImagenAbierto);
		}
	}

	cancelarRecorte(){
		this.imagenRecortada = null;
		this.urlImagenBeat = null;
		this.modalAddImagenAbierto = false;
	}

	guardarImagenBeat(dataImagen){
		this._beatService.guardarImagenBeat(this.token, dataImagen).subscribe(
			response => {
				if(response){
					console.log(response)
					// return response.etiqueta;
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.status = 'error';
				}
			}
		);
	}



}
