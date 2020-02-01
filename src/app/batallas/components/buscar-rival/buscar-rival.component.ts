import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Batalla } from '../../../models/batalla';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'buscar-rival',
  templateUrl: './buscar-rival.component.html',
  providers: [UserService, BatallaService]
})
export class BuscarRivalComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public batallas: Batalla[];
  public total;

  public likes;
	public totalLikes;

  public misBatallas: Batalla[];
  public totalMisBatallas;

  public solicitudesBatalla: Batalla[];
  public totalSolicitudesBatalla;

  public batallasBuscandoRival: Batalla[];
  public totalBuscandoRival;
  public intervaloBuscandoRival;

  public filtroBatalla = "";

  public rondasFiltro = ['2','3','4'];
  public tiempoRondas = ['60','120'];
  public modoRondas = ['libre','palabras','imagenes'];
  public sangreRondas = ['si','no'];
  public acapellaRondas = ['si','no'];
  public intentosRondas = ['1','2','3'];

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
    console.log('buscar-rival.component cargado');
    this.getBatallasBuscandoRival();
    this.getSolicitudesBatallaUsuario(this.identity._id);
  }

  cambiarTab(event, nombre){
    var i, contenidoTab, botonTab;
    contenidoTab = document.getElementsByClassName("contenido-tab");
    for (i = 0; i < contenidoTab.length; i++) {
        contenidoTab[i].style.display = "none";
    }
    botonTab = document.getElementsByClassName("boton-tab");
    for (i = 0; i < botonTab.length; i++) {
      botonTab[i].className = botonTab[i].className.replace(" active", "");
    }
    document.getElementById(nombre).style.display = "block";
    event.currentTarget.className += " active";
  }

  cambiarTabMisBatallas(event, nombre){
    var i, contenidoTab, botonTab;
    contenidoTab = document.getElementsByClassName("contenido-tab-mis-batallas");
    for (i = 0; i < contenidoTab.length; i++) {
        contenidoTab[i].style.display = "none";
    }
    botonTab = document.getElementsByClassName("boton-tab-mis-batallas");
    for (i = 0; i < botonTab.length; i++) {
      botonTab[i].className = botonTab[i].className.replace(" active", "");
    }
    document.getElementById(nombre).style.display = "block";
    event.currentTarget.className += " active";
  }

  getSolicitudesBatallaUsuario(idUsuario){
    this._batallaService.getSolicitudesBatallaUsuario(idUsuario).subscribe(
      response => {
        if(response.batallas){
          this.totalSolicitudesBatalla = response.total;
          this.solicitudesBatalla = response.batallas;

          console.log(this.solicitudesBatalla);
          console.log(this.totalSolicitudesBatalla);

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

  getBatallasBuscandoRival(){
    this._batallaService.getBatallasBuscandoRival().subscribe(
      response => {
        if(response.batallas){
          this.totalBuscandoRival = response.total;
          this.batallasBuscandoRival = response.batallas;

          console.log(this.totalBuscandoRival + " personas búscando rival.");
          console.log(this.batallasBuscandoRival);

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

  seleccionarDesseleccionarFiltro(parametroFiltro,valor,idElemento){
    if($("#"+idElemento).hasClass("active")){
      
      if(parametroFiltro == 'rondas'){
          const index = this.rondasFiltro.indexOf(valor);

          if(this.rondasFiltro.length === 1){
            alert("Debe haber un parámetro seleccionado cómo minimo.");
          } else {
            this.rondasFiltro.splice(index, 1);
            $("#"+idElemento).removeClass("active");
          }          
 
        
      } else if(parametroFiltro == 'tiempo-ronda') {
        const index = this.tiempoRondas.indexOf(valor);

        if(this.tiempoRondas.length === 1){
          alert("Debe haber un parámetro seleccionado cómo minimo.");
        } else {
          this.tiempoRondas.splice(index,1);
          $("#"+idElemento).removeClass("active");
        }        

      } else if(parametroFiltro == 'modo') {
        const index = this.modoRondas.indexOf(valor);

        if(this.modoRondas.length === 1){
          alert("Debe haber un parámetro seleccionado cómo minimo.");
        } else {
          this.modoRondas.splice(index,1);
          $("#"+idElemento).removeClass("active");
        }   
      } else if(parametroFiltro == 'sangre') {
        const index = this.sangreRondas.indexOf(valor);
        if(this.sangreRondas.length === 1){
          alert("Debe haber un parámetro seleccionado cómo minimo.");
        } else {
          this.sangreRondas.splice(index,1);
          $("#"+idElemento).removeClass("active");
        } 
      } else if(parametroFiltro == 'acapella') {
        const index = this.acapellaRondas.indexOf(valor);
        if(this.acapellaRondas.length === 1){
          alert("Debe haber un parámetro seleccionado cómo minimo.");
        } else {
          this.acapellaRondas.splice(index,1);
          $("#"+idElemento).removeClass("active");
        }
      }

      this.getBatallasBuscandoRival();
    }else {
      
      if(parametroFiltro == 'rondas'){
          this.rondasFiltro.push(valor);
          $("#"+idElemento).addClass("active");        
      } else if(parametroFiltro == 'tiempo-ronda') {
        this.tiempoRondas.push(valor);
        $("#"+idElemento).addClass("active");
      } else if(parametroFiltro == 'modo') {
        this.modoRondas.push(valor);
        $("#"+idElemento).addClass("active");
      } else if(parametroFiltro == 'sangre') {
        this.sangreRondas.push(valor);
        $("#"+idElemento).addClass("active");
      } else if(parametroFiltro == 'acapella') {
        this.acapellaRondas.push(valor);
        $("#"+idElemento).addClass("active");
      } else if(parametroFiltro == 'intentos') {
        this.intentosRondas.push(valor);
        $("#"+idElemento).addClass("active");
      }

      this.getBatallasBuscandoRival();
    }

 

  }
}


