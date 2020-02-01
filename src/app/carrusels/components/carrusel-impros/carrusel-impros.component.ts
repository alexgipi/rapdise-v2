import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { Destacado } from '../../../models/destacado';
import { User } from '../../../models/user';

import { UserService } from '../../../services/user.service';
import { DestacadoService } from '../../../services/destacado.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'carrusel-impros',
  templateUrl: './carrusel-impros.component.html',
  providers: [UserService, DestacadoService]
})
export class CarruselImprosComponent implements OnInit {
	public url: string;
	public status: string;

	public identity;
	public token;

	public destacado: Destacado;
	public destacados: Destacado[];
	public totalDestacados;

	public paginasCarrusel;
	public paginaActual;

	public indexCarrusel = 1;
	public moverPixels = 0;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
    private _userService: UserService,
    private _destacadoService: DestacadoService
	){
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}
	
	ngOnInit(){
		console.log('Carrusel de impros cargado');
    this.getDestacados("freestyle");
  }
  
  getDestacados(tipo){
    this._destacadoService.getDestacados(tipo).subscribe(
      response => {
        if(response.destacados){
          this.destacados = response.destacados;
          this.totalDestacados = response.total;

          console.log("Freestyles destacados: ", this.destacados);
          console.log(this.totalDestacados);
        }
      },
      error => {

      }
    )
	}
	
	formatearSegundos(tiempo){
		tiempo = Math.round(tiempo);

		var minutos = Math.floor(tiempo / 60);
		var segundos = (tiempo - minutos * 60 as any);
	
		segundos = segundos < 10 ? '0' + segundos : segundos;

		return minutos + ":" + segundos;
	}

	public Arr = Array; //Array type captured in a variable
	carruselPrev(){
		this.indexCarrusel = this.indexCarrusel - 1;
		
		this.moverPixels = this.moverPixels - 235;
		$(".carousel-impros").css("transform", "translatex(-"+ this.moverPixels + "px)");
		this.carruselComprobarIndex();
	}


	carruselNext(){
		this.indexCarrusel = this.indexCarrusel + 1;
			this.moverPixels = this.moverPixels + 235;
			$(".carousel-impros").css("transform", "translatex(-" + this.moverPixels + "px)");
			this.carruselComprobarIndex();
	}
	

	carruselComprobarIndex(){
		if(this.indexCarrusel == 0) {
			this.indexCarrusel = this.totalDestacados;	
			this.moverPixels = (235 * this.totalDestacados)-235;
			$(".carousel-impros").css("transform", "translatex(-" + this.moverPixels + "px)");
		
		} else if(this.indexCarrusel > this.totalDestacados) {
				this.indexCarrusel = 1;
				this.moverPixels = 0;
				$(".carousel-impros").css("transform", "translatex(" + this.moverPixels + "px)");
		} else if(this.indexCarrusel == 1){
			this.indexCarrusel = 1;
			this.moverPixels = 0;
			$(".carousel-impros").css("transform", "translatex(" + this.moverPixels + "px)");
		}
	}
}
