import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'registro-finalizado',
  templateUrl: './registro-finalizado.component.html',
  providers: [UserService]
})

export class RegistroFinalizadoComponent implements OnInit {
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
		this.titulo = 'Registro finalizado';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
	ngOnInit(){
        console.log('Componente de registro-finalizado cargado..');
    }
}