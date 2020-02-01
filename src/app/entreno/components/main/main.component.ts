import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  providers: [UserService]
})
export class MainComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService
  ){
  	this.title = 'Entreno';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    console.log('main.component cargado');
    this.cargarPagina();
    $("body").addClass("rep-general-abierto");
    $(".reproductor-general").addClass("abierto");
    $(".icono-cerrar-rep-general").removeClass("display-none");
  }

  ngOnDestroy(){
    $("body").removeClass("rep-general-abierto");
    $(".reproductor-general").removeClass("abierto");
    $(".icono-cerrar-rep-general").addClass("display-none");
  }

  cargarPagina(){
		this._route.params.subscribe(params => {
      console.log(params.modo);
		});
	}

}
