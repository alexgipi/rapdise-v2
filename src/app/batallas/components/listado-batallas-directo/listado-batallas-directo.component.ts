import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'listado-batallas-directo',
  templateUrl: './listado-batallas-directo.component.html',
  providers: [UserService]
})
export class ListadoBatallasDirectoComponent implements OnInit {
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
  	this.title = 'Batallas en directo';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
  	console.log('en-directo.component cargado');
  }

}
