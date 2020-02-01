import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Batalla } from '../../../models/batalla';
import { ComentarioBatalla } from '../../../models/comentario-batalla';


//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { ComentarioService } from '../../../services/comentario.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'comentarios-batalla',
  templateUrl: 'comentarios-batalla.component.html',
  providers: [UserService, BatallaService, ComentarioService]
})
export class ComentariosBatallaComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;
  
  public user: User;
  public idBatalla;

  public comentarios: ComentarioBatalla[];
  public comentario: ComentarioBatalla;
  public totalComentarios;
  

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
    private _batallaService:BatallaService,
    private _comentarioService:ComentarioService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  	this.titulo= 'Comentarios de la batalla';
    this.url = GLOBAL.url;
    if(this.identity){
        this.comentario = new ComentarioBatalla("", "", this.identity._id, "", "", "");
    }else {
        this.comentario = new ComentarioBatalla("", "", "", "", "", "");
    }
    
  }

    ngOnInit(){
        console.log('comentarios-batalla.component cargado');
        this.cargarPagina();
    }

    cargarPagina(){
        this._route.params.subscribe(params => {
            this.idBatalla = params['idBatalla'];
            this.getComentariosBatalla(this.idBatalla);
        });
    }

    getComentariosBatalla(idBatalla){
        this._comentarioService.getComentariosBatalla(idBatalla).subscribe(
            response => {
                if(!response.comentarios){
                    alert("no hay comentarios");
          
                }else {
                    this.comentarios = response.comentarios;
                    this.totalComentarios = response.total;
                    console.log(this.comentarios);
                }                
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        )
    }

     comentarBatalla(form){
        this.comentario.batalla = this.idBatalla;

        this._comentarioService.comentarBatalla(this.token,this.comentario).subscribe(
            response => {
                if(response.comentario){
					this.status = 'success';
                    form.reset();
                    this.getComentariosBatalla(this.idBatalla);
				}else {
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
        )
    }

}
