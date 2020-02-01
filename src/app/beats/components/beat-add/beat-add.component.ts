import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {FormControl} from '@angular/forms';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import {FormGroup} from '@angular/forms';

export interface Fruit {
	name: string;
  }

// import { of } from 'rxjs';
// import { filter } from 'rxjs/operators'

import { ImageCroppedEvent } from 'ngx-image-cropper';


import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter'

import { Beat } from '../../../models/beat';
import { Etiqueta } from '../../../models/etiqueta';

import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { UploadService } from '../../../services/upload.service';
import { EtiquetaService } from '../../../services/etiqueta.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'beat-add',
  templateUrl: './beat-add.component.html',
  providers: [UserService, BeatService, UploadService, EtiquetaService]
})

export class BeatAddComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public estado: string;
	public beat: Beat;
	public beats: Beat[];
	public beatAEditar: Beat;

	public editandoBeat:boolean = true;

	public urlAudioBeat: null;
	public duracionAudioBeat;
	public urlImagenBeat: null;

	public etiqueta: Etiqueta;
	public etiquetas: Etiqueta[];

	imageChangedEvent: any = '';
	imagenRecortada: any = '';
	
	public selectedLanguage = 'es';
	

	estiloBeat = new FormControl();
	estilosDisponibles: string[] = ['Old School', 'Trap', 'Underground', 'Boom Bap', 'Jazzy', 'Lofi', 'Reggae', 'Dancehall', 'Indie'];

	public tipoCaratula = 'rapdise';

	public myGroup;

	

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _beatService: BeatService,
		private _uploadService: UploadService,
		private _etiquetaService: EtiquetaService,
		private domSanitizer: DomSanitizer,
		public translate: TranslateService
	){
		this.titulo = 'Añadir beat';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		if(this.identity)this.beat = new Beat("", "","","","", "", "", "", "", false,false,false,"","", "", "", "","", "", this.identity._id);
		else this.beat = new Beat("", "","","","", "", "", "", "", false,false,false,"","", "", "", "","", "", "");
		this.etiqueta = new Etiqueta("", "beat","");
		this.beat.etiquetas = new Array;		
	}
	ngOnInit(){
		console.log('Componente de beats cargado!');
		this.getBeatsUsuario();
		this.myGroup = new FormGroup({
			archivoAudio: new FormControl(),
			archivoImagen: new FormControl(),
		 });
	}

	

	mySelections: string[];

	changed() {
		if (this.estiloBeat.value.length < 4) {
			this.mySelections = this.estiloBeat.value;
			this.beat.style = this.estiloBeat.value;
			console.log(this.beat)
		} else {
			this.estiloBeat.setValue(this.mySelections);
		}

		
	}

	setTipoCaratula(tipo){
		this.tipoCaratula = tipo;
	}


	especificarUsos(uso){
		if(uso == 'libre'){
			this.beat.permitirBatalla = true;
			this.beat.permitirGrabacion = true;
			this.beat.permitirEntreno = true;
		} else {
			this.beat.permitirBatalla = false;
			this.beat.permitirGrabacion = false;
			this.beat.permitirEntreno = false;
		}
	}

	elegirPermiso(permiso){
		if(permiso == 'batalla'){
			if(this.beat.permitirBatalla == false){
				this.beat.permitirBatalla = true;
			} else {
				this.beat.permitirBatalla = false;
			}
		} else if (permiso == 'grabacion') {
			if(this.beat.permitirGrabacion == false){
				this.beat.permitirGrabacion = true;
			} else {
				this.beat.permitirGrabacion = false;
			}
		} else if (permiso == 'entreno'){
			if(this.beat.permitirEntreno == false){
				this.beat.permitirEntreno = true;
			} else {
				this.beat.permitirEntreno = false;
			}
		}
	}

	onSubmit(form){
		this.beat.duration = this.duracionAudioBeat;
		this.guardarBeat(form);
	}

	public audiosASubir: Array<File>;

	audioFileChange(fileInput: any){
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
					}
				}, 1200);
			}
		} else {
			alert("Debes subir un archivo de audio mp3");
			this.audiosASubir = <Array<File>>[];
		}

		
		
	}

	getBeatsUsuario(){
		this._beatService.getBeatsUsuario(this.identity.nick).subscribe(
			response => {
				if(response.beats){
					this.beats = response.beats;
					console.log(this.beats);
				} else {
					this.estado = 'error';
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.estado = 'error';
				}
			}
		)
	}

	public modalAbierto: boolean = false;
	abrirModalEditar(beat){
		if(beat){
			this.beatAEditar = beat;
			console.log(this.beatAEditar);
			this.modalAbierto = true;
		}
	}

	cerrarModal(event):void{ //CERRAR MODAL DEL COMPONENTE HIJO beat-edit
		if(event.cerrarModal == true){
			this.modalAbierto = false;
		}
	}

	guardarBeat(form){
		var unix = Math.round(+new Date()/1000);
		var imgBeatUsuario = "imagen-beat-"+this.identity.nick+"-"+unix;
		this.beat.image = imgBeatUsuario + ".png"
		console.log(this.beat);
		
		this._beatService.addBeat(this.token, this.beat).subscribe(
			response => {
				if(response.beat){
					this.estado = 'success';

					if(!this.audiosASubir){
						this._router.navigate(['/bases-de-rap',response.beat.style]);
					}else {
						console.log(response.beat._id);

						
						this._uploadService.makeFileRequest(this.url+'guardar-archivo-beat/'+response.beat._id, [], this.audiosASubir, this.token, 'file')
						.then((result: any) => {
							console.log(result);
							this.getBeatsUsuario();
							this.imagenRecortada  = null;
							this.imagenesASubir = [];
							this.audiosASubir = [];
							this.audiosASubir = null;

							console.log(this.etiquetas);
							this.etiquetas.forEach(etiqueta => {
								console.log(etiqueta._id);
							});
						});

						this.guardarImagenBeat(this.imagenRecortada, imgBeatUsuario);
					}
					
					form.reset({ style: '', uso: '', file: '', image: '' });
					this.urlAudioBeat = null;
					this.urlImagenBeat = null;
					this.etiquetas = [];
					this.beat.etiquetas = [];
					this.estiloBeat = null;

					

					// this._router.navigate(['/libreria-de-beats',response.beat.style]);
				}else {
					this.estado = 'error';
				}
				console.log(response)
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.estado = 'error';
				}
			}
		);
	}
	
	

	// Subir imagen

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
	

	// RECORTAR IMAGEN SUBIDA

    imageCropped(event: ImageCroppedEvent) {
		console.log(event);
		this.imagenRecortada = event.base64;

		console.log(this.imagenesASubir);
		
    }
    imageLoaded() {
		// show cropper
		this.abrirCerrarModalAddImagen();
		this.setTipoCaratula('imagen');
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


	// ETIQUETAS

	addEtiqueta(etiqueta){
		var valor = etiqueta.valor;

		this.etiqueta.valor = valor;

		this._etiquetaService.addEtiqueta(this.token, this.etiqueta).subscribe(
			response => {
				if(response.etiqueta){
					this.beat.etiquetas.push({
						_id: response.etiqueta._id,
						tipo: 'beat',
						valor: this.etiqueta.valor
					});

					console.log(this.beat.etiquetas);
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.estado = 'error';
				}
			}
		);
	}


	quitarEtiqueta(event){
		alert("Quitar etiqueta " + event.valor);
		this.etiqueta.valor = event.valor;
		const index = this.beat.etiquetas.findIndex(etiqueta => etiqueta.valor === this.etiqueta.valor); 
		this.beat.etiquetas.splice(index, 1);
		console.log(this.beat.etiquetas)
	}

	public onAdding(etiqueta): Observable<string> {
		etiqueta = '#'.concat(etiqueta.replace(/#|_|-/g,'').replace(/\s/g, ''));
        return Observable
            .of(etiqueta);
    }

	public onRemoving(tag): Observable<string> {
        const confirm = window.confirm('Seguro que quieres eliminar esta etiqueta?');
        return Observable
            .of(tag)
            .filter(() => confirm);
	}

	abrirInputFileBeat(){
		$("#subir-audio-beat").click();
	}

	guardarImagenBeat(base64, nArchivo){
		var miObjeto = (new Object()as any);
		miObjeto.imagenBase64 = base64;
		miObjeto.nombreArchivo = nArchivo;
		console.log(miObjeto);
		
		this._beatService.guardarImagenBeat(this.token,miObjeto).subscribe(
		  response => {
			console.log(response);
		  },
		  error => {
			var errorMessage = <any>error;
			GLOBAL.DEBUG && console.log(errorMessage);
		  }
		);
	}

	

}
