import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UploadService } from '../../../services/upload.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'informacion-personal',
  templateUrl: './informacion-personal.component.html',
  providers: [UserService, UploadService]
})

export class InformacionPersonalComponent implements OnInit {
	public titulo:string;
	public user: User;
	public status:string;
	public identity;
	public token;
	public url: string;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _uploadService: UploadService
	){
		this.titulo = 'Actualizar mis datos';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}
	ngOnInit(){
		console.log(this.user);
		console.log('Componente userEdit cargado!');
	}

	editarUsuario(redireccion = false){
		
		console.log(this.user);
		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.status = 'error';
				}else {
					this.status = 'success';
					localStorage.setItem('identity', JSON.stringify(this.user));
					this.identity = this.user;

					if(this.filesToUpload){
						//Subida de imagen de perfil
						this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
							.then((result: any) => {
								this.user.image = result.user.image;
								localStorage.setItem('identity', JSON.stringify(this.user));
							});
					}
					if(this.filesToUpload2){					//Subida de imagen de portada
						this._uploadService.makeFileRequest(this.url+'upload-imagen-portada/'+this.user._id, [], this.filesToUpload2, this.token, 'portada')
							.then((result: any) => {
								this.user.portada = result.user.portada;
								localStorage.setItem('identity', JSON.stringify(this.user));
							});
					}

					if(redireccion == true) {
						this._router.navigate(['registro-finalizado']);
					}
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

	public filesToUpload: Array<File>;
	public filesToUpload2: Array<File>;

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}

	fileChangeEvent2(fileInput: any){
		this.filesToUpload2 = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload2);
	}

	sumarRepu() {
		console.log(this.user);

		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.status = 'error';
				}else {
					this.status = 'success';
					this.identity.reputation = (this.identity.reputation*1)+1;
					localStorage.setItem('identity', JSON.stringify(this.user));
					this.identity = this.user;
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
}
