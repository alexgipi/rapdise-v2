import { Component, OnInit, DoCheck, OnChanges , SimpleChanges , SimpleChange  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Beat } from '../../../models/beat';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GLOBAL } from '../../../services/global';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'listado-beats-subidos',
  templateUrl: './listado-beats-subidos.component.html',
  providers: [UserService, BeatService]
})
export class ListadoBeatsSubidosComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;
  public beats: Beat[];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
      private _userService:UserService,
      private _beatService:BeatService,
      public translate: TranslateService
  ){
  	this.title = 'Listado beats subidos';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(){
    console.log('listado-beats-subidos.component cargado');
    this.getBeatsUsuario();
  }

  getBeatsUsuario(){
		this._beatService.getBeatsUsuario(this.identity.nick).subscribe(
      
			response => {
				if(response.beats){
					this.beats = response.beats;
          console.log(this.beats);
				} else {
					this.status = 'error';
				}
			},
			error => {
				var mensajeError = <any>error;
				console.log(mensajeError);

				if(mensajeError != null){
					this.status = 'error';
				}
			}
		)
  }
  
  ngOnChanges(changes: SimpleChanges) {
		// const currentItem: SimpleChange = changes.tipoCaratula;
	
		// if(currentItem.currentValue == 'imagen'){
		//   console.log('got item: ', currentItem.currentValue);
		// }
	
		if (this.beats && changes.beats) {
		  if (changes.beats.currentValue != changes.beats.previousValue ){
			console.log('value changed to ' + this.beats)
			this.beats = this.beats;			
		  }
		}
	}

}
