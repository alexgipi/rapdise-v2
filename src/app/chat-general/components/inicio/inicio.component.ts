import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as io from 'socket.io-client';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { BatallaDirecto } from '../../../models/batalla-directo';

import { Mensaje } from '../../../models/mensaje';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { BatallaDirectoService } from '../../../services/batalla-directo.service';
import { AjustesService } from '../../../services/ajustes.service';

import { GLOBAL } from '../../../services/global';

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  providers: [UserService, BeatService, BatallaDirectoService, AjustesService]
})
export class InicioComponent implements OnInit {
  public titulo:string;
  public identity;
  public url: string;
  public estado:string;

  public users:User[];

  public mensajes: Mensaje[];

  public mensaje: Mensaje;

  public socket: SocketIOClient.Socket;
  public urlSocket;

  public batallaDirecto: BatallaDirecto;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
    private _ajustesService:AjustesService,
    private _beatService:BeatService,
    private _batallaDirectoService:BatallaDirectoService
  ){
  	this.titulo = 'Batallas en directo';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);

    this.mensaje = new Mensaje("","","",this.identity._id,"", "", "", "", "", "", "");
  }

    ngOnInit(){
        console.log('batalla-en-directo.component cargado');
        this.cargarPagina();
        var that = this;

        $('.footer').css("display", "none");

       console.log(this.mensajes);

       this._ajustesService.getAjustesChatPublicoUsuario(this.identity._id).subscribe(
         response => {
           if(response.ajustes){
             console.log(response.ajustes);
           }

         },
         error => {
           var mensajeError = <any>error;
           console.log(mensajeError);

           if(mensajeError != null){
            this.estado = 'error';
          }
         }
       );
    }

  cargarPagina(){
    this.getUsers();

    this.cargarSocket();
  
  }


  cargarSocket(){
    var that = this;

    this.socket.on('mensajes', function(mensajes){
        console.log(mensajes);

        that.render(mensajes);
    });
  }  

  render(mensajes){
    var that = this;
      var html = mensajes.map(function(mensaje, index){

        if(mensaje.emisor.nick == that.identity.nick){
          return (`
            <li class="clearfix">
              <div class="mensaje-data align-right">
                <span class="mensaje-data-fecha" >10:10 AM, Today</span> &nbsp; &nbsp;
                <span class="mensaje-data-nombre" >${mensaje.emisor.nick}</span>                
              </div>
              <div class="mensaje otro-mensaje verde float-right">
                ${mensaje.texto}
              </div>
            </li>
          `);
        }else {
          return (`
            <li class="flex flex-wrap">
              <div class="mensaje-data">
                <span class="mensaje-data-nombre">${mensaje.emisor.nick}</span>
                <span class="mensaje-data-fecha">10:12 AM, Today</span>
              </div>
              <div class="mensaje blanco">
                ${mensaje.texto}
              </div>
            </li>
          `);
        }
      }).join(' ');

      var div_mensajes = document.getElementById("mensajes");

      var div_chat = document.querySelector(".contenido-chat");

      div_mensajes.innerHTML = html;
      div_chat.scrollTop = div_chat.scrollHeight;
  }

  addMensaje(){

    var nickUsuario;

    if(this.identity){
      nickUsuario = this.identity.nick;
    }

      // Recibido del formulario
      this.mensaje.tipo = 'publico';
      this.mensaje.emisor = this.identity._id;

      this.socket.emit('add-mensaje-general', this.mensaje);
      (<any>document.getElementById("mensaje-a-enviar")).value = "";
      
      return false;
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response => {
        if(response.users){
          this.users = response.users;
          console.log(this.users);
        }else {
          this.estado = 'error';
        }
      },
      error => {
        var mensajeError = <any>error;
        console.log(mensajeError);

        if(mensajeError != null){
					this.estado = 'error';
				}
      }
    )
  }
  

}
