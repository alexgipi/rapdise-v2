import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import sortBy from 'sort-by';

//modelos
import { User } from '../../../models/user';
import { Batalla } from '../../../models/batalla';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'mis-batallas',
  templateUrl: './mis-batallas.component.html',
  providers: [UserService, BatallaService]
})
export class MisBatallasComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;

  public misBatallas: Batalla[];
  public totalMisBatallas;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _batallaService:BatallaService
  ){
  	this.title = 'Batallas de gallos';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(){
    console.log('listado-batallas.component cargado');

    if(this.identity) {
      this.getBatallasEstadoUsuario("En marcha",this.identity._id);
    }

  }

  public viendoBatallas = 'en-marcha';

  //Mis Batallas
  getBatallasEstadoUsuario(estado,idUsuario){
    this._batallaService.getBatallasEstadoUsuario(estado,idUsuario).subscribe(
      response => {
        if(response.batallas){
          this.totalMisBatallas = response.total;
          this.misBatallas = response.batallas;

          if(estado == 'Finalizada') {
           this.viendoBatallas = 'finalizadas';
          } else if(estado == 'En marcha') {
            this.viendoBatallas = 'en-marcha';
          }

          console.log(this.misBatallas);
          console.log(this.totalMisBatallas);

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

  // Ordenar según select en el html
  getBatallasOrdenadasPor(propiedad){

    this.misBatallas = this.misBatallas.sort(sortBy(propiedad));
      
  }

  getSolicitudesBatallaUsuario(idUsuario){
    this._batallaService.getSolicitudesBatallaUsuario(idUsuario).subscribe(
      response => {
        if(response.batallas){
          this.totalMisBatallas = response.total;
          this.misBatallas = response.batallas;
          this.viendoBatallas = 'peticiones';

          console.log(this.misBatallas);
          console.log(this.totalMisBatallas);

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

  verMasVerMenosTexto(){

    if($("#texto-desplegable").hasClass("abierto")){
      $("#texto-desplegable").removeClass("abierto");
      $("#mi-ver-mas-texto").html("Ver más +");      
    } else {
      $("#texto-desplegable").addClass("abierto");
      $("#mi-ver-mas-texto").html("Ver menos -");
    }
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
