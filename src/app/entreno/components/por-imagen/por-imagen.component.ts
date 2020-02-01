import { Component, OnInit, DoCheck, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';

//Servicios
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { PalabrasService } from '../../../services/palabras.service';
import { ImagenesService } from '../../../services/imagenes.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'por-imagen',
  templateUrl: './por-imagen.component.html',
  providers: [UserService, BeatService, PalabrasService, ImagenesService]
})
export class PorImagenComponent implements OnInit, AfterViewInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;  

  public beats: Beat[];
  public beat: Beat;
  public totalBeats;
  public primerBeat;
  public idBeat1:string;
  public beatSeleccionado;

  public sonando: boolean = false;

  public entrenando: boolean = false;
  public intervalocontadorImagen;
  public tiempoRestanteImagen;

  public intervaloCambioImagen;
  public tiempoCambio:number = 10000;

  public palabras;

  public imagenes;
  public imagenAleatoria;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _beatService:BeatService,
    private _palabrasService:PalabrasService,
    private _imagenesService:ImagenesService
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
  }

  ngOnInit(){
    this.getImagenes();
      console.log('ver-batalla.component cargado');
      $(".footer").css("display", "none");
  }

  ngAfterViewInit(){
    this.onResize();
  }

  onResize(anchura = null, altura = null) {
    if(anchura != null && altura != null){
      console.log("Anchura: ",anchura + " Altura: ", altura);
    }
    
    var anchuraVentana = $(window).innerWidth();
    
    var alturaParrafo = $(".parrafo-entreno-grabadora").innerHeight();

    console.log("Altura parrafo: " + alturaParrafo);


    if(anchuraVentana <= 1275){
      if(alturaParrafo == undefined){
        $(".panel-entreno").css("height", "calc(100% - 60px - 85px)");
      }else {
        $(".panel-entreno").css("height", "calc(100% - 60px - 85px - "+alturaParrafo+"px)");
      }
    }else {
      if(alturaParrafo == undefined){
        $(".panel-entreno").css("height", "calc(100% - 60px)");
      }else {
        $(".panel-entreno").css("height", "calc(100% - 60px - "+alturaParrafo+"px)");
      }
    }
    
  }

  borrarParrafo(){
    alert("borrar parrafo")
    $(".parrafo-entreno-grabadora").remove();
    this.onResize();
  }

  ngOnDestroy(){
    clearInterval(this.intervalocontadorImagen);
    clearInterval(this.intervaloCambioImagen);
  }
  
  public empezarEntreno() {
    this.entrenando = true;      
    this.iniciarReproductor();
    
    $(".contenedor-tiempo-entreno").css("display", "inline-block");
    
    $("#btn-parar-entreno").css("display", "inline-block");

    $(".menu-modo-panel").css({display:'none'});
    $(".menu-modo-titulo").css({display:'flex'});
    
    var that = this;  

    that.imagenesEntreno();

    setTimeout( function(){
      that.onResize();
    }, 200 );
  }

  public pararEntreno() {
    this.entrenando = false;
    this.pararReproductor();

    clearInterval(this.intervalocontadorImagen);
    clearInterval(this.intervaloCambioImagen);
    $("#contador-imagen").html(this.tiempoCambio / 1000);

    $(".menu-modo-panel").css({display:'flex'});
    $(".menu-modo-titulo").css({display:'none'});

    var that = this;
    setTimeout( function(){
      that.onResize();
    }, 200 );
  }

  iniciarReproductor(){
    (document.getElementById("audio-reproductor-con-listado") as any).load();
    (document.getElementById("audio-reproductor-con-listado") as any).play();
    this.sonando = true;
  }

  pararReproductor(){
    (document.getElementById("audio-reproductor-con-listado") as any).pause();
    this.sonando = false;
  }

  elegirTiempoCambio(tiempoCambio){
    this.tiempoCambio = tiempoCambio;
    console.log(this.tiempoCambio);

    if(this.entrenando == true){
      $(".palabra-entreno").remove();
      clearInterval(this.intervaloCambioImagen);
      this.imagenesEntreno();
    }      
    
    $(".boton-tiempo-cambio").removeClass("active");

    if(this.tiempoCambio == 5000){
      $(".entreno-5s").addClass("active");
    }else if(this.tiempoCambio == 10000){
      $(".entreno-10s").addClass("active");
    }else if(this.tiempoCambio == 15000){
      $(".entreno-15s").addClass("active");
    }

    $(".input-editar-cambio").addClass("display-none");
  }


  imagenesEntreno() {     

    this.crearImagenAleatoria();
    var that = this;

    this.intervaloCambioImagen = setInterval(function() {

      that.crearImagenAleatoria();
      
    }, that.tiempoCambio);
  }

  selecionarBeat(beat){
    this.beat = beat;
    this.idBeat1 = this.beat._id;
  }

  contadorImagen(){
    var that = this;
    clearInterval(this.intervalocontadorImagen);
    this.tiempoRestanteImagen = this.tiempoCambio / 1000;
    that.mostrarTiempoImagen(that.tiempoRestanteImagen);
    
    this.intervalocontadorImagen = setInterval(function(){
      that.tiempoRestanteImagen--;
      that.mostrarTiempoImagen(that.tiempoRestanteImagen);
    },1000);			
  }

  mostrarTiempoImagen(segundos) {
    $("#contador-imagen").html(segundos);
  }

  getImagenes(){
    this._imagenesService.getImagenes().subscribe(
      response => {
        if(response.hits){
          this.imagenes = response.hits;
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
  
  public totalImgUsadas = 0;
  public numerosAleatoriosSalidos = [];
  crearImagenAleatoria(){    
    var num = Math.floor(Math.random() * (this.imagenes.length));        
    
    if (this.numerosAleatoriosSalidos.includes(num)){ // Si el numero ya ha salido reinicia la funcion
        this.crearImagenAleatoria();     
    } else { // Si no ha salido se incluye el numero al array de numeros salidos y se crea la nueva imagen
      this.numerosAleatoriosSalidos.push(num);
      console.log(this.numerosAleatoriosSalidos);
      this.imagenAleatoria = this.imagenes[num];
      this.contadorImagen();
      
      this.totalImgUsadas++;   
      
      if(this.totalImgUsadas === this.imagenes.length){ //Una vez mostradas todas las imagenes, reinicia numerosAleatoriosSalidos y totalImgUsadas a 0        
        this.numerosAleatoriosSalidos = [];
        this.totalImgUsadas = 0;
      }
    }

  }

  mostrarEditarCambio() {
    var contenedorInput = $("#input-editar-cambio");
    var input = $("#input-editar-cambio input");
    if(contenedorInput.hasClass('display-none')){
      contenedorInput.removeClass("display-none");
    }
    input.focus();

    var that = this;
    input.attr("value", that.tiempoCambio / 1000)

    $(".boton-tiempo-cambio").removeClass("active");
    $(".entreno-tiempo-personalizado").addClass("active");
  }

  cambioPersonalizado(value){
    console.log(value);

    var tiempoCambio = value * 1000;

    this.tiempoCambio = tiempoCambio;
    console.log(this.tiempoCambio);
    
    if(this.entrenando == true){
      $(".palabra-entreno").remove();
      clearInterval(this.intervaloCambioImagen);
      this.imagenesEntreno();
    }    
  }

}
