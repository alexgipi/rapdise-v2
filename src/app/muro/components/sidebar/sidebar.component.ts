import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { User } from '../../../models/user';
import { Publication } from '../../../models/publication';
import { UserService } from '../../../services/user.service';
import { PublicationService } from '../../../services/publication.service';
import { YoutubeService } from '../../../services/youtube.service';

import { UploadService } from '../../../services/upload.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  providers: [UserService, PublicationService, UploadService, YoutubeService]
})

export class SidebarComponent implements OnInit {
	// public titulo:string;
	// public user: User;
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;

	public tipoPublicacion = "texto";
	public hayImagen:boolean = false;

	public enlaceYoutube;
	public videoYoutube;

	public nuevaPubForm;

	public form: FormGroup;
	public formPubTexto: FormGroup;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService,
		private _uploadService: UploadService,
		private _youtubeService: YoutubeService,
		private fb: FormBuilder
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		if(this.identity){
			this.publication = new Publication("", "", "", "", "", "", "","", "", "", "", this.identity._id);
		} else {
			this.publication = new Publication("", "", "", "", "", "", "","", "", "", "", "");
		}
		
		this.createForm();
		
	}
	ngOnInit(){
		console.log('Componente de sidebar cargado');
		
	}

	createForm() {
		const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w?= .-]*/?';
		this.form = this.fb.group({
			s_url: ['', [Validators.required, Validators.pattern(reg)]],
			publicationImagenText: [''],
			publicationVideoText: [''],
			publicationTextoText: ['']
		});

		this.formPubTexto = this.fb.group({
			publicationTextoText: ['']
		});
	}	

	get s_url() { return this.form.get('s_url') };
	get publicationVideoText() { return this.form.get('publicationVideoText') };
	get publicationImagenText() { return this.form.get('publicationImagenText') };
	get publicationTextoText() { return this.formPubTexto.get('publicationTextoText') };


	public srcMiniaturaVideo;	
	public idEnlaceYT;
	valueEnlaceYoutube(value){
		console.log(value, value.length);

		if(value.length > 3){

			if(this.s_url.status.toLocaleLowerCase() == 'invalid') {
				console.log(this.s_url.status)
			} else if (this.s_url.status.toLocaleLowerCase() == 'valid') {
				console.log(this.s_url.status)

				var enlaceYT_split = value.split('//');  // --> (0)https:// (1)www.youtube.com/watch?v=VnIObXdmYCk
				var enlace = enlaceYT_split[1];
	
				var ultimoParamUrl = enlace.split('/')[1]; // (0)www.youtube.com/(1)watch?v=VnIObXdmYCk o (0)youtu.be/(1)VnIObXdmYCk
	
				var ultimoParamUrlSplit = ultimoParamUrl.split('=');
	
				if(ultimoParamUrlSplit.length === 1){ // (0)VnIObXdmYCk
					
					this.idEnlaceYT = ultimoParamUrlSplit[0];
					console.log(this.idEnlaceYT);
					this.videoYoutube = true;
	
				} else if(ultimoParamUrlSplit.length === 2){ // (0)watch?v=(1)VnIObXdmYCk				
					this.idEnlaceYT = ultimoParamUrlSplit[1];
					console.log(this.idEnlaceYT);
					this.videoYoutube = true;
	
				}
	
				var that = this;
	
				this.srcMiniaturaVideo = '//i.ytimg.com/vi/'+this.idEnlaceYT+'/hqdefault.jpg';
			}


			
		}

	}

	noExisteImagenYT(){
			alert("no existe la imagen");
	}

	cambiarTipoPub(tipoPub){
		this.tipoPublicacion = tipoPub;		
	}

	onSubmit(form, event){
		this.publication.tipo = this.tipoPublicacion;

		
		

		if(this.tipoPublicacion == 'video'){
			this.publication.text = this.publicationVideoText.value;
			this.publication.videoYT = this.s_url.value;
		} else if (this.tipoPublicacion == 'imagen'){
			this.publication.text = this.publicationImagenText.value;
		} else if (this.tipoPublicacion == 'texto'){
			this.publication.text = this.publicationTextoText.value;
		} 

		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response => {
				if(response.publication){
					// this.publication = response.publication;
					this.notificacionToast("publicado", response.publication.tipo);

					if(this.filesToUpload && this.filesToUpload.length){					
						//Subir imagen
						this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'file')
							.then((result:any) => {
								this.status = 'success';
								this.publication.file = result.publication.file;

								this.formPubTexto.reset();
								this.form.reset();
								this.videoYoutube = false;
								this.hayImagen = false;
								this.srcMiniaturaVideo = '';
								
								this.sended.emit({send:'true'});
								
								this.filesToUpload = [];
								console.log(this.filesToUpload);								
							});
					}else {
						this.status = 'success';
						this.form.reset();
						this.formPubTexto.reset();
						this.sended.emit({send:'true'});
						this.hayImagen = false;
						this.srcMiniaturaVideo = '';
						this.videoYoutube = false;

					}
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

	public imageSrc;
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput:any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
		if(this.filesToUpload.length === 0){

			console.log("No hay imagen");

		} else if(this.filesToUpload.length > 0){
			var archivo = this.filesToUpload[0];
			
			if (archivo.type.match('image.*')) { //Si es de tipo image
				console.log("SI hay imagen");
				this.hayImagen = true;

				const reader = new FileReader();
				reader.onload = e => this.imageSrc = reader.result;
		
				reader.readAsDataURL(archivo);
           	} else {
				alert("debes subir imagenes");
			}
			
		}
	}



	public tiempoToast;
	notificacionToast(accion, tipoPub){
		
		$(".zona-mi-toast").empty();
		clearTimeout(this.tiempoToast);

		var that = this;

		if(accion == "publicado"){
			
			$(".zona-mi-toast").append(`
				<div class="mi-toast toast-anadido">
					<span class="mi-toast-nombre-accion">
						Nueva publicación de ${tipoPub} añadida.
					</span>
				</div>
			`);
			
			requestAnimationFrame(function () {
				$(".toast-anadido").addClass("toast-visible");
				
				that.tiempoToast = setTimeout(function(){
					$(".toast-anadido").removeClass("toast-visible");
				}, 4000);
			});
			
		}

				
	}
	

	//Output
	@Output() sended = new EventEmitter();
}
