import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Batalla } from '../../../models/batalla';


//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { BeatService } from '../../../services/beat.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'nueva-batalla-desafiar',
  templateUrl: 'nueva-batalla-desafiar.component.html',
  providers: [UserService, BatallaService, BeatService]
})
export class NuevaBatallaDesafiarComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;
  
  public users: User[];
  public user: User;
  public totalUsers;
  public primerUser;
  public nickUser:string;

  public indexCarruselUsers = 1;
  public moverPixelsCarrusel = 0;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
    private _beatService:BeatService,
    private _batallaService:BatallaService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  	this.titulo= 'Creador de Batallas';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
      console.log('nueva-batalla.component cargado');
      this.getUsuarios();
  }

  getUsuarios(){
    this.indexCarruselUsers = 1;
    this.moverPixelsCarrusel = 0;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + 0 +"px, 0px, 0px)");

    this._userService.getUsers().subscribe(
      response => {
        if(!response.users){
          this.status = 'error';
        }else {
          this.users = response.users;
          this.totalUsers = response.total;

          this.primerUser = this.users['0'];
          this.nickUser = this.primerUser.nick;

          this.getUser(this.nickUser);

		$(".items-carrusel-seleccion-beat .flex").css("width", this.totalUsers * 233.07 + 453.58);

          console.log(this.users);
          console.log("Total: " + this.totalUsers);
          console.log(this.nickUser);        
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

  carruselNext(){
    this.moverPixelsCarrusel = this.moverPixelsCarrusel + 233.07;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");

    this.indexCarruselUsers = this.indexCarruselUsers + 1;

    $(".item-carrusel-seleccion-beat").removeClass("active");
    $(".user-carrusel"+this.indexCarruselUsers).addClass("active");

    var valueNickUser= $(".user-carrusel"+this.indexCarruselUsers).attr("value");
    this.nickUser = valueNickUser;

    this.getUser(this.nickUser);
  }

  carruselPrev(){
    this.moverPixelsCarrusel = this.moverPixelsCarrusel - 233.07;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");

    this.indexCarruselUsers = this.indexCarruselUsers- 1;
         
    $(".item-carrusel-seleccion-beat").removeClass("active");
    $(".user-carrusel"+this.indexCarruselUsers).addClass("active");

    var valueNickUser = $(".user-carrusel"+this.indexCarruselUsers).attr("value");
    this.nickUser = valueNickUser;

    this.getUser(this.nickUser);
  }

  carruselComprobarIndex(){
		if(this.indexCarruselUsers == 0) {
		  this.indexCarruselUsers = this.totalUsers;
		  this.moverPixelsCarrusel = this.indexCarruselUsers * 233.07 - 233.07;
		  $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");
		} else if(this.indexCarruselUsers > this.totalUsers) {
		    this.indexCarruselUsers = 1;
		    this.moverPixelsCarrusel = this.indexCarruselUsers * 233.07 - 233.07;
		    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");
		}
  }

  getUser(nick){
    this._userService.getUser(nick).subscribe(
      response => {
        if(!response.user){
          this._router.navigate(['/']);

        }else {
          this.user = response.user;
          console.log(this.user);
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
