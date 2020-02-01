import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../models/user';

import { UserService } from '../../../services/user.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'beats-favoritos',
  templateUrl: './beats-favoritos.component.html',
  providers: [UserService]
})

export class BeatsFavoritosComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,

	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}
	ngOnInit(){
		console.log('Componente de beats favoritos cargado!');
		this.cargarPagina();
	}

	cargarPagina(){
		this.titulo = 'Mis beats favoritos';
	}
}
