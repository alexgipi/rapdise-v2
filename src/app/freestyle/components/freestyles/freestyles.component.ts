import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import sortBy from 'sort-by';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Grabacion } from '../../../models/grabacion';

//Servicios
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GrabacionService } from '../../../services/grabacion.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'freestyles',
  templateUrl: './freestyles.component.html',
  providers: [UserService, GrabacionService, BeatService]
})
export class FreestylesComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;  

  public beats: Beat[];
  public beat: Beat;

  public grabaciones: Grabacion[];
  public totalGrabaciones;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _beatService:BeatService,
    private _grabacionService:GrabacionService
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

    ngOnInit(){
        console.log('freestyles.component cargado');
        this.getGrabaciones();
           
    }

    getGrabaciones(){
      this._grabacionService.getGrabacionesTipoFreestyle().subscribe(
        response => {
          if(response.grabaciones){
            this.totalGrabaciones = response.total;
            this.grabaciones = response.grabaciones;
      
            console.log(this.grabaciones);
            console.log(this.totalGrabaciones);
      
          }else{
            this.status = 'error';
          }
          },
          error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          this.status = 'error';
          }
      )
    }

    getGrabacionesOrdenadasPor(propiedad){

      this.grabaciones = this.grabaciones.sort(sortBy(propiedad));
        
    }


    formatearSegundos(tiempo){
      tiempo = Math.round(tiempo);
  
      var minutos = Math.floor(tiempo / 60);
      var segundos = (tiempo - minutos * 60 as any);
    
      segundos = segundos < 10 ? '0' + segundos : segundos;
  
      return minutos + ":" + segundos;
    }

    borrarGrabacion(grabacion){
      console.log(grabacion);
    }



    

}
