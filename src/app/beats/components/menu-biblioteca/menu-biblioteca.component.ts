import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'menu-biblioteca',
  templateUrl: './menu-biblioteca.component.html',
  providers: [UserService]
})
export class MenuBibliotecaComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
      private _userService:UserService,
      public translate: TranslateService
  ){
  	this.title = 'Menu biblioteca';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
  	console.log('menu-biblioteca.component cargado');
  }

}
