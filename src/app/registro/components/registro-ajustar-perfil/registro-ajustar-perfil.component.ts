import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'registro-ajustar-perfil',
  templateUrl: './registro-ajustar-perfil.component.html',
  providers: [UserService]
})

export class RegistroAjustarPerfilComponent implements OnInit {
	public titulo:string;
	public identity;
	public token;
	public user: User;
	public status: string;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.titulo = 'Registro';
		this.user = new User("", "", "", "", "", "", "ROLE_USER", "", "", "", "", "", "", "","","", "", "", "", "", "", "","", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "");
	}
	ngOnInit(){
        console.log('Componente de registro cargado..');
        $("#ajustes-identidad-cuenta").css("display", "none");
        $("#ajustes-cambiar-clave").css("display", "none");

        $("#ajustes-guardar-cambios").addClass("display-none");
        $("#ajustes-finalizar-registro").removeClass("display-none");
    }

	onSubmit(form){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.user && response.user._id) {
					// console.log(response.user);
					this.status = 'success';
					this.user = response.user;
					// form.reset();

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
								this._router.navigate(['ajustes/informacion-personal']);

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
}