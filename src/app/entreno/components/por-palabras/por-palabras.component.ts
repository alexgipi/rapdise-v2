import { Component, OnInit, AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';

//Servicios
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { PalabrasService } from '../../../services/palabras.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'por-palabras',
  templateUrl: './por-palabras.component.html',
  providers: [UserService, BeatService, PalabrasService]
})
export class PorPalabrasComponent implements OnInit, AfterViewInit {
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
  public intervaloContadorPalabra;
  public tiepoRestantePalabra;

  public intervaloCambioPalabra;
  public tiempoCambio = 10000;

  public palabras;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _beatService:BeatService,
    private _palabrasService:PalabrasService
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
  }

    ngOnInit(){
        console.log('ver-batalla.component cargado');      
        $(".footer").css("display", "none");

        
    }

    ngAfterViewInit(){
      this.onResize();
    }

    ngOnDestroy(){
      clearInterval(this.intervaloContadorPalabra);
      clearInterval(this.intervaloCambioPalabra);
    }

    onResize(anchura = null, altura = null) {
      if(anchura != null && altura != null){
        console.log("Anchura: ",anchura + " Altura: ", altura);
      }
      
      var anchuraVentana = $(window).innerWidth();
      
      var alturaParrafo = $(".parrafo-entreno-grabadora").outerHeight();

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
    
    public empezarEntreno() {
      this.entrenando = true;

      
      this.iniciarReproductor();
      
      $(".contenedor-tiempo-entreno").css("display", "inline-block");
      
      $("#btn-parar-entreno").css("display", "inline-block");
      
      var that = this;
      
      setTimeout( function(){
        that.palabrasEntreno();
        that.onResize();
      }, 200 );
    }
  
    public pararEntreno() {
      this.entrenando = false;
      this.pararReproductor();

      $(".palabra-grabadora").remove();      
      clearInterval(this.intervaloContadorPalabra);
      clearInterval(this.intervaloCambioPalabra);
      $("#contador-palabra").html(this.tiempoCambio / 1000);

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
        $(".palabra-grabadora").remove();
        clearInterval(this.intervaloCambioPalabra);
        this.palabrasEntreno();
      }      
      
      $(".boton-tiempo-cambio").removeClass("active");

      if(tiempoCambio == 5000){
        $(".entreno-5s").addClass("active");
      }else if(tiempoCambio == 10000){
        $(".entreno-10s").addClass("active");
      }else if(tiempoCambio == 15000){
        $(".entreno-15s").addClass("active");
      }
      
      $("#input-editar-cambio").addClass("display-none");
    }

    palabrasEntreno() {
        var that = this;
  
        // var barraProgreso = document.querySelector(".barra-progreso-entreno .barra");
        // var bar = new ProgressBar.Line(barraProgreso, {duration: that.tiempoCambio,color: '#37abc8',trailColor: '#eee',svgStyle: {width: '100%', height: '15px', borderRadius:'10px'}});
  
        var contenedorPalabras = document.querySelector(".palabras-grabadora");
        var divPalabra:any = document.createElement("div");
        divPalabra.className = 'palabra-grabadora';
        contenedorPalabras.appendChild(divPalabra);
  
        // bar.animate(1);
        var palabraInicial = this.palabras[Math.floor(Math.random() * (this.palabras.length))];  
        $(".palabras-grabadora .palabra-grabadora").text(palabraInicial);
        this.contadorPalabra();
  
        that.intervaloCambioPalabra = setInterval(function() {
          // bar.set(0);
          // bar.animate(1);
          var palabraAleatoria = that.palabras[Math.floor(Math.random() * (that.palabras.length))];
          that.contadorPalabra();
          
          //añadir palabraAleatoria a array de palabras de la batalla
  
          $(".palabras-grabadora .palabra-grabadora").text(palabraAleatoria);
        }, that.tiempoCambio);
    }

    selecionarBeat(beat){
      this.beat = beat;
      this.idBeat1 = this.beat._id;
    }

    contadorPalabra(){
			var that = this;
      clearInterval(this.intervaloContadorPalabra);
      this.tiepoRestantePalabra = this.tiempoCambio / 1000;
      that.mostrarTiempoPalabra(that.tiepoRestantePalabra);
      
      this.intervaloContadorPalabra = setInterval(function(){
        that.tiepoRestantePalabra--;
        that.mostrarTiempoPalabra(that.tiepoRestantePalabra);
			},1000);			
    }

    mostrarTiempoPalabra(segundos) {
      $("#contador-palabra").html(segundos);
    }
    
    // formatearTiempo(segundos) {
    //   var minutes = (<any> Math.floor(segundos / 60));
    //   minutes = (minutes >= 10) ? minutes : "0" + minutes;
    //   segundos = Math.floor(segundos % 60);
    //   segundos = (segundos >= 10) ? segundos : "0" + segundos;
  
    //   $("#contador-palabra").html(minutes + ":" + segundos);
    // }

    borrarParrafo(){
      alert("borrar parrafo")
      $(".parrafo-entreno-grabadora").remove();
      this.onResize();
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
      $("#entreno-tiempo-personalizado").addClass("active");
    }

    public segundosCambio;
    cambioPersonalizado(value){
      console.log(value);
      this.segundosCambio = value;

      var tiempoCambio = this.segundosCambio * 1000;

      this.tiempoCambio = tiempoCambio;
      console.log(this.tiempoCambio);
      
      if(this.entrenando == true){
        $(".palabra-grabadora").remove();
        clearInterval(this.intervaloCambioPalabra);
        this.palabrasEntreno();
      } 
    }

}
