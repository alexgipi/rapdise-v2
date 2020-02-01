import { Component, OnInit, Input,} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../../services/global';

import { UserService } from '../../../services/user.service';
import { ChatService } from '../../../services/chat.service';

//MODELOS

import { Mensaje } from '../../../models/mensaje';

@Component({
  selector: 'panel-chat',
  templateUrl: './panel-chat.component.html',
  providers: [UserService]
})
export class PanelChatComponent implements OnInit {
  public titulo:string;
  public url: string;
  public status: string;
  public identity;
  public token;

  public mensaje: Mensaje;
  
  public mensajes: Mensaje[];

  public idEmisor = "";
  public idReceptor = "";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _chatService: ChatService
  ){
  	this.titulo = 'Panel chat';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.mensaje = new Mensaje("", "privado", "", "", "", "", "", "", "", "", "");
  }

  

  ngOnInit(){
    console.log('panel-chat.component cargado');
   

    if(this.identity) {
      this.getUsuarios();
      this.getChatsPrivadosUsuario(this.identity._id);
    }    
  }

  public chatsUsuario;
  getChatsPrivadosUsuario(idUsuario){
    this._chatService.getChatsPrivadosUsuario(idUsuario).subscribe(
      response => {
        if(response.chats){
          this.chatsUsuario = response.chats;
          console.log(this.chatsUsuario);
        }else {
          this.status = 'error';
        }
      },
      error => {
        var mensajeError = <any>error;
        console.log(mensajeError);
        this.status = 'error';
      }
    )
  }
  public usuarios;
  getUsuarios(){
    this._userService.getUsersYSeguidores(this.identity._id).subscribe(
      response => {
        if(response.users){
          this.usuarios = response.users;
          console.log(this.usuarios);
        }
      }
    )
  }

  public receptor;
  
  abrirChat(idChat,receptor){
    this._chatService.abrirChat(idChat);
    this.getMensajes();
    this.receptor = receptor;
  }

  getMensajes(){
    this._chatService.getMensajes().subscribe(
      response => {
        if(response){
          this.mensajes = response;
          console.log(this.mensajes)
        } else {
          this.status = 'error';
        }
        
      },
      error => {
        var mensajeError = <any>error;
        console.log(mensajeError);
        this.status = 'error';
      }
    );
  }

  enviarMensaje(emisor, receptor) {
    this._chatService.enviarMensaje(this.mensaje, emisor, receptor);
    this.mensaje.texto = '';

    this.getMensajes();
  }

  

  

}