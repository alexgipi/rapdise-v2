import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { AudioGrabacion } from '../../../models/audio-grabacion';
import { Grabacion } from '../../../models/grabacion';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { LikeBatallaService } from '../../../services/like-batalla.service';
import { BeatService } from '../../../services/beat.service';
import { GrabacionService } from '../../../services/grabacion.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'editar-grabacion',
  templateUrl: './editar-grabacion.component.html',
  providers: [UserService, BatallaService, LikeBatallaService, BeatService, GrabacionService]
})
export class EditarGrabacionComponent implements OnInit {
  @Input() grabacion: Grabacion;
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;  

  public audioGrabacion: AudioGrabacion;


  public mostrarFormGuardar: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _grabacionService:GrabacionService
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

    ngOnInit(){
        console.log('editar-grabacion.component cargado');
    }

    editarGrabacion(){
      this.mostrarFormGuardar = false;

      var id = this.grabacion._id;
      alert(this.grabacion._id);

      this._grabacionService.editarGrabacion(this.token, id, this.grabacion).subscribe(
        response => {
          if(response.grabacion){
            console.log(response.grabacion);
            alert("grabacion editada");
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

}
