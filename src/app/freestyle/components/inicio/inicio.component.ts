import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';

//Servicios
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;


@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  providers: [UserService, BeatService]
})

export class InicioComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;  

  public beats: Beat[];
  public beat: Beat;

  public beatLocalStorage;
  public modoFreestyleLocalStorage;

  public modoFreestyle = 'Palabras';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _beatService:BeatService
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

    ngOnInit(){
      GLOBAL.DEBUG && console.log('ver-batalla.component cargado');
        

        $(".footer").css("display", "none");

       

        this.beatLocalStorage = JSON.parse(localStorage.getItem("beat_seleccionado"));

        var that = this;
        setTimeout(function(){
          that.detectarAdblock();
        }, 400);
        
    }

    recibirBeat(event):void{
      this.beat = event.beat;
      
    }

    public adBlockDetectado:boolean;

    detectarAdblock(){

        var that = this;
        if($(".anuncio").height() > 0) {
            that.adBlockDetectado = false;
            
        } else {
            that.adBlockDetectado = true;
            
        }
    
    }

    

}
