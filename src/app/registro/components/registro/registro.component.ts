import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { ListaGeneral } from '../../../models/lista-general';

import { UserService } from '../../../services/user.service';
import { ListaGeneralService } from '../../../services/lista-general.service';

@Component({
  selector: 'registro',
  templateUrl: './registro.component.html',
  providers: [UserService, ListaGeneralService]
})

export class RegistroComponent implements OnInit {
	public titulo:string;
	public identity;
	public token;
	public user: User;
	public status: string;
	public mostrandoClave:boolean = false;

	public lista: ListaGeneral;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _listaGeneralService: ListaGeneralService
	){
		this.titulo = 'Registro';
		this.user = new User("", "", "", "", "", "", "ROLE_USER", "", "", "", "", "","", "", "", "", "", "", "", "", "","", "", "", "", "", "","", "", "",  "", "", "", "","", "", "", "", "", "");
		this.identity = this._userService.getIdentity();
		if(this.identity){
			this.lista = new ListaGeneral("", "","","","","publica", "", "", this.identity._id,"", "" , "", "");
		} else {
			this.lista = new ListaGeneral("", "","","","","publica", "", "", "","", "" , "", "");
		}
		this.token = this._userService.getToken();
	}
	ngOnInit(){
		console.log('Componente de registro cargado..');
		if(this.identity) {
			alert("hola");
			this._router.navigate(['/']);
		}
	}

	onSubmit(form){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.user && response.user._id) {
					// console.log(response.user);
					this.status = 'success';
					this.user = response.user;

					//INICIAR SESION					
					this._userService.loginEnRegistro(this.user.email).subscribe(
						response => {
							console.log(response.user);
							this.identity = response.user;

							
							console.log(this.identity);

							

							if(!this.identity || !this.identity._id){
								this.status = 'error';
							}else {
								// PERSISTIR DATOS DEL USUARIO
								localStorage.setItem('identity', JSON.stringify(this.identity));

								// CONSEGUIR EL TOKEN
								this.getToken(this.user.email);

								

								// this.crearLista('Batallas favoritas','batalla');
								// this.crearLista('Bases favoritas','beat');
								// this.crearLista('Freestyles favoritos','freestyle');
								
								this._router.navigate(['registro/ajustar-perfil']);
								

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
				}else {
					this.status = 'error';
				}

			},
			error => {
				console.log(<any>error);
			}
		);
	}

	getToken(user){
		this._userService.loginEnRegistro(user, 'true').subscribe(
			response => {
				this.token = response.token;
				console.log(this.token);
				this.crearListasFavoritosUsuario();
				
				if(this.token.length <= 0){
					this.status = 'error';
				}else {
					// PERSISTIR Token DEL USUARIO
					localStorage.setItem('token', this.token);
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

	mostrarClave(){
		this.mostrandoClave = true;
		$("#password").attr("type", "text");
	}

	ocultarClave(){
		this.mostrandoClave = false;
		$("#password").attr("type", "password");
	}

	crearLista(nombreLista,tipoLista){
		this.lista.nombre = nombreLista;
		this.lista.tipo = tipoLista;
		
		console.log(this.lista);
		

		this._listaGeneralService.crearLista(this.token, this.lista).subscribe(
			response => {
				if(response.lista){
          			this.status = 'success';
          			alert("Lista creada con exito.");

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

	crearListasFavoritosUsuario(){
		this._listaGeneralService.crearListasFavoritosUsuario(this.token).subscribe(
			response => {
				if(response.lista1 && response.lista2 && response.lista3){
          			this.status = 'success';
          			alert("Listas creada con exito.");

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
}

