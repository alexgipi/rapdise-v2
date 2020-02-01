import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as io from 'socket.io-client';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { BatallaDirecto } from '../../../models/batalla-directo';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { BatallaDirectoService } from '../../../services/batalla-directo.service';

import { GLOBAL } from '../../../services/global';

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'batalla-en-directo',
  templateUrl: './batalla-en-directo.component.html',
  providers: [UserService, BeatService, BatallaDirectoService]
})
export class BatallaEnDirectoComponent implements OnInit {
  public titulo:string;
  public identity;
  public url: string;
  public status:string;

  public grabando: boolean = false;
  private chunks: any = [];
  private mediaRecorder: any;

  public mensajes: Array<any> = [{
    id: 1,
    texto: 'Bienvenido al chat publico creado con Socket.io y NodeJS',
    nick: 'AlexGimipiki95'
  }];

  public socket: SocketIOClient.Socket;
  public urlSocket;

  public batallaDirecto: BatallaDirecto;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
    private _beatService:BeatService,
    private _batallaDirectoService:BatallaDirectoService
  ){
  	this.titulo = 'Batallas en directo';
    this.url = GLOBAL.url;
    this.urlSocket = GLOBAL.urlSocket;
    this.identity = this._userService.getIdentity();
    this.socket = io.connect(this.urlSocket);
  }

    ngOnInit(){
        console.log('batalla-en-directo.component cargado');
        this.cargarPagina();
        this.cargarGrabadora();
        var that = this;
        // setTimeout( function(){
        //     that.grabar();
        // }, 1000 );
       console.log(this.mensajes);

       $(".footer").addClass("display-none");
  
    }

  cargarPagina(){
    this._route.params.subscribe(params => {
        var nickBatallaDirecto = params['nick'];
        this.getBatallaDirecto(nickBatallaDirecto);   
        this.cargarSocket();     
    });
  }

  getBatallaDirecto(nick){
      alert(nick);
      
      this._batallaDirectoService.getBatallaDirecto(nick).subscribe(
        response => {
          if(!response.batallaDirecto){
              this._router.navigate(['/']);

          }else {
              this.batallaDirecto = response.batallaDirecto;
              console.log(this.batallaDirecto);            
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

  editarBatallaDirecto(){

  }

  cargarGrabadora(){
    // visualiser setup - create web audio api context and canvas
    var audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();

    if (navigator.mediaDevices.getUserMedia) {
      const onSuccess = stream => {
        
          this.mediaRecorder = new MediaRecorder(stream);

          var that = this;

          // Al parar de grabar  
          this.mediaRecorder.onstop = e => {
              alert("Directo cerrado");
              const audio:any = document.getElementById("grabacion");  
              const blob = new Blob(this.chunks, { 'type': 'audio/*' });
              
              this.chunks.length = 0;
              var blobURL = window.URL.createObjectURL(blob);

              audio.src = blobURL;
          
          };

          this.mediaRecorder.ondataavailable = e =>  {
              this.chunks.push(e.data);
              alert("grabando");
          }

        };

        const onError = err => {
          alert("debes conectar una camara");
        };

        navigator.getUserMedia = (navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia);

        navigator.getUserMedia({ audio: true, video: true }, onSuccess, onError, e => console.log(e));
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }
  
  public grabar() {
    this.grabando = true;
    
    this.mediaRecorder.start();
    $("#tiempo_grabadora").css("display", "inline-block");
  }

  public pararDeGrabar() {
    this.grabando = false;
    this.mediaRecorder.stop();
  }

  cargarSocket(){
    var that = this;

    this.socket.on('mensajes', function(data){
        console.log(data);

        that.render(data);
    });
  }  

  render(data){
    console.log(data);
      var html = data.map(function(mensaje, index){
          return (`
              <div class="mensaje">
                  <strong>${mensaje.nick}</strong> dice:
                  <p>${mensaje.texto}</p>
              </div>
          `);
      }).join(' ');

      document.getElementById("mensajes").innerHTML = html;
  }

  addMensaje(form){
    console.log(form);
    var nickUsuario;

    if(this.identity){
      nickUsuario = this.identity.nick;
    }else {
      nickUsuario = "Invitado";
    }

      // Recibido del formulario
      var mensaje = {
          nick: nickUsuario,
          texto: (<any>document.getElementById("texto")).value
      }

      this.socket.emit('add-mensaje', mensaje);
      (<any>document.getElementById("texto")).value = "";
      
      return false;
  }
  

}
