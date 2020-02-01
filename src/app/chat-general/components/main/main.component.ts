import { Component, OnInit, DoCheck } from '@angular/core';
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
  	this.title = 'Batalla';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
  	console.log('main.component cargado');
  }

}
