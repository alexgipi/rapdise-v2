import { Component, Directive, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Batalla } from '../../../models/batalla';
import { User } from '../../../models/user';

import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'carrusel-esperando-respuesta',
  templateUrl: './carrusel-esperando-respuesta.component.html',
  providers: [BatallaService, UserService]
})

export class CarruselEsperandoRespuestaComponent implements OnInit {
	public url: string;
	public status: string;

	public identity;
	public token;

	public batalla: Batalla;
	public batallas: Batalla[];
	public totalBatallas;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _batallaService: BatallaService,
	){
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}
	
	ngOnInit(){
		console.log('Carrusel de temas cargado');
		this.getBatallasBuscandoRival();		
	}

	getBatallasBuscandoRival(){
    this._batallaService.getBatallasBuscandoRival().subscribe(
      response => {
        if(response.batallas){
					this.batallas = response.batallas;
					this.totalBatallas = response.total;

        }else{
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

	public batallaSeleccionada:Batalla;
	
	seleccionarBatalla(batalla){
		this.batallaSeleccionada = batalla;
		console.log("batalla seleccionada", this.batallaSeleccionada)

		this.abrirResponderBatalla();
	}
	

	abrirResponderBatalla(){
		$(".modal-responder-batalla").addClass("abierto");
	}
}
