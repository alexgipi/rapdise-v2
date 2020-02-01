import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { ProfesionesService } from '../../../services/profesiones.service';
import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

@Component({
  selector: 'por-profesiones',
  templateUrl: './por-profesiones.component.html',
  providers: [UserService, BeatService, ProfesionesService]
})

export class PorProfesionesComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public beat: Beat;
  public beatsEstilo: Beat[];
  public total;

  public entrenando = false;
  public intervalo;
  public duracionIntervalo = 10000;
  public profesiones;

  public beatElegido;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _beatService: BeatService,
    private _profesionesService: ProfesionesService

  ){
    this.title = 'Entreno';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.profesiones = this._profesionesService.getProfesiones();
  }
  ngOnInit(){
    console.log('Componente de entreno profesiones por estilos cargado!');
    this.loadPage();
  }

  loadPage(){
    this._route.params.subscribe(params => {
      let style = params['style'];

      if(style){
        this.getBeatsEstilo(style);
        //Marcar item del select como seleccionado
        $("#estilo-"+style+"").attr("selected","selected");

        //Boton TODOS de elegir estilo, pinntar del mismo color que los otros elementos, conflicto RLActive
        $("#todos").css("background-color", "#37abc8");
      }else {
        //Obtener todos los beats
        this.getBeatsEstilo('todos');
      }

      $("#estilo_entreno").text(style);

    });
  }

  getBeat(id){
    this._beatService.getBeat(id).subscribe(
      response => {
        if(!response.beat){
          this._router.navigate(['/']);

        }else {
          this.beat = response.beat;
          console.log(this.beat);
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

  getBeatsEstilo(style){
    var id;
		if(this.identity){
			id = this.identity._id;
		} else {
			id = "";
		}
    this._beatService.getBeatsEstilo(style,id).subscribe(
      response => {
        if(response.beats){
          this.total = response.total;
          this.beatsEstilo = response.beats;

          this.beatElegido = this.beatsEstilo[0];
          console.log(this.beatElegido);
          
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

  elegirEstilo(value){
    var estilo = value;
    console.log('Estilo: ',estilo);

    if(estilo == "todos") {
      this._router.navigateByUrl('/entreno/profesiones');
    }else {
      this._router.navigateByUrl('/entreno/profesiones/'+estilo+'');
    }
  }

  previewBeat(id){
    /*Parar reproductor principal para evitar conflictos*/
    $("#boton-pause").css("display", "none");
    $("#boton-play").css("display", "inline-block");
    (document.getElementById("player") as any).load();
    
    //Cambiar icono de nota-musical a volumen-sonando
    $("#"+id).removeClass("fa-music");
    $("#"+id).addClass("fa-volume-up");

    //Reproducir beat del preview
    (document.getElementById("audio-"+id) as any).play();
  }

  pararPreviewBeat(id){
    //Cambiar icono de volumen sonando a icono nota-musical
    $("#"+id).removeClass("fa-volume-up");
    $("#"+id).addClass("fa-music");

    //Parar beat del preview
    (document.getElementById("audio-"+id) as any).load();
  }

  seleccionarBeat(id){

    if ( $(".capa-"+id).is( ".active" ) ) {
      this.startPlayer(this.beat);   
      this.empezarEntrenoPalabras();
      $('#modal-entreno').modal({backdrop: 'static', keyboard: false})  
    } else {
      $(".capa-estoy-listo").removeClass("active");
      $(".capa-"+id).addClass("active");
      this.getBeat(id);

      $(".seleccionar-beat").css("color", "rgba(255, 255, 255, 0.7)");
      $(".seleccionar-beat").removeClass("fa-check");

      $("#"+id).css("color", "rgb(67, 194, 112)");

      $("#"+id).removeClass("fa-volume-up");
      $("#"+id).addClass("fa-check");

    }

    $(".boton-empezar-entreno").css("display","none");
    $("#boton-entreno-"+id).fadeIn(200);

  }

  startPlayer(beat){
    let beat_player = JSON.stringify(beat);
    let file_path = this.url + 'get-audio-beat/' + beat.file;

    let image_beat_path = this.url + 'get-imagen-beat/' + beat.image;

    localStorage.setItem('beat_sonando', beat_player);

    document.getElementById("mp3-source").setAttribute("src", file_path);
    (document.getElementById("player") as any).load();
    (document.getElementById("player") as any).play();

    document.getElementById("nombre-beat").innerHTML = beat.name;
    document.getElementById("autor-beat").innerHTML = beat.user.nick;
    document.getElementById("img-beat").setAttribute("src", image_beat_path);

  }

  empezarEntrenoPalabras() {
    var that = this;

    this.entrenando = true;

    var barraProgreso = document.querySelector(".barra-progreso-entreno .barra");
    var bar = new ProgressBar.Line(barraProgreso, {duration: that.duracionIntervalo,color: '#37abc8',trailColor: '#eee',svgStyle: {width: '100%', height: '15px', borderRadius:'10px'}});

    var contenedorPalabras = document.querySelector(".contenedor-palabras");
    var divPalabra:any = document.createElement("div");
    divPalabra.className = 'palabra';
    contenedorPalabras.appendChild(divPalabra);

    bar.animate(1);
    var palabraInicial = this.profesiones[Math.floor(Math.random() * (this.profesiones.length))];
    $(".contenedor-palabras .palabra").text(palabraInicial);

    that.intervalo = setInterval(function() {
      bar.set(0);
      bar.animate(1);
      var palabraAleatoria = that.profesiones[Math.floor(Math.random() * (that.profesiones.length))];
      $(".contenedor-palabras .palabra").text(palabraAleatoria);
    }, that.duracionIntervalo);
  }

  cambiarTiempo(id){
    var that = this;

    if (this.intervalo) {
       clearInterval(this.intervalo);
    }

    $(".contenedor-palabras").empty();

    $(".cat-list__item").removeClass("active");
    $("#" + id).parent('li').addClass('active');

    if(id == "5s"){
      this.duracionIntervalo = 5000;
    }else if (id == "10s") {
      this.duracionIntervalo = 10000;
    }else if (id == "15s") {
      this.duracionIntervalo = 15000;
    }

    var barraProgreso = document.querySelector(".barra-progreso-entreno .barra");
    $(".barra-progreso-entreno .barra").empty();
    var bar = new ProgressBar.Line(barraProgreso, {duration: that.duracionIntervalo,color: '#37abc8',trailColor: '#eee',svgStyle: {width: '100%', height: '15px', borderRadius:'10px'}});

    var contenedorPalabras = document.querySelector(".contenedor-palabras");
    var divPalabra:any = document.createElement("div");
    divPalabra.className = 'palabra';
    contenedorPalabras.appendChild(divPalabra);

    bar.animate(1);
    var palabraInicial = this.profesiones[Math.floor(Math.random() * (this.profesiones.length))];
    $(".contenedor-palabras .palabra").text(palabraInicial);

    that.intervalo = setInterval(function() {
      bar.set(0);
      bar.animate(1);
      var palabraAleatoria = that.profesiones[Math.floor(Math.random() * (that.profesiones.length))];
      $(".contenedor-palabras .palabra").text(palabraAleatoria);
    }, that.duracionIntervalo);
  }

  pararEntreno(){
    if(this.identity){
      alert("¡Buen entreno, "+this.identity.nick+"!");
    } else {
      alert("¡Buen entreno, anonimo! ¡Registrate ya y sacale todo el jugo a improvisa.me!");
    }
    this.entrenando = false;
    if (this.intervalo) {
       clearInterval(this.intervalo);
    }
    $(".contenedor-palabras").empty();
    $(".barra-progreso-entreno .barra").empty();
  }

}