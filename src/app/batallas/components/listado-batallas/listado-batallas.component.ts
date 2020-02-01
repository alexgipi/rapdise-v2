import { Component, OnInit, DoCheck } from '@angular/core';
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
  selector: 'listado-batallas',
  templateUrl: './listado-batallas.component.html',
  providers: [UserService, BatallaService]
})
export class ListadoBatallasComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public batallas: Batalla[];
  public totalBatallas;

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

    this.getBatallasEstado("Finalizada");
  }

  getBatallasEstado(estado){
    var idUsuario = '';
    if(this.identity){
      idUsuario = this.identity._id;
    }
    this._batallaService.getBatallasEstado(estado,idUsuario).subscribe(
      response => {
        if(response.batallas){
          this.totalBatallas = response.total;
          this.batallas = response.batallas;

          console.log(this.batallas);
          console.log(this.totalBatallas);

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

  getBatallasOrdenadasPor(propiedad){

    this.batallas = this.batallas.sort(sortBy(propiedad));
      
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


}
