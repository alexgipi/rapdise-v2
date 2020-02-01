import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';

import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'modal-login-para-accion',
  templateUrl: './modal-login-para-accion.component.html',
  styleUrls:  ['./style.css'],
  providers: [UserService]
})

export class ModalLoginParaAccionComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService

	){
		this.titulo = 'Modal login para accion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		
	}
    
	ngOnInit(){
		console.log('Componente ModalLoginParaAccionComponent cargado!');
    }

    public modalAbierto =  false;
    
    abrirCerrarModal(){
		if(this.modalAbierto == false){
			this.modalAbierto = true;
		}else {
			this.modalAbierto = false;
		}
	}

	
}
