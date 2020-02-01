import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Options } from 'ng5-slider';

//modelos
import { User } from '../../../models/user';
import { AudioGrabacion } from '../../../models/audio-grabacion';
import { Grabacion } from '../../../models/grabacion';
import { Beat } from '../../../models/beat';
import { Publication } from '../../../models/publication';

//Servicios
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GrabacionService } from '../../../services/grabacion.service';
import { PalabrasService } from '../../../services/palabras.service';
import { ImagenesService } from '../../../services/imagenes.service';
import { PublicationService } from '../../../services/publication.service';


import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'grabadora-free-palabras',
  templateUrl: './grabadora-free-palabras.component.html',
  providers: [UserService, BeatService, GrabacionService, PalabrasService, ImagenesService, PublicationService]
})
export class GrabadoraFreePalabrasComponent implements OnInit {
 @Input() beat: Beat;
 
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;

  public beatLocalStorage;
  public sonando;
  
  public beatUsado;
  public tiempoGrabado;

  public volumenBeatGrabacion = 0.7;
  public volumenVozGrabacion = 1;

  public audioGrabacion: AudioGrabacion;
  public grabacion: Grabacion;

  public grabando: boolean = false;
  private chunks: any = [];
  private mediaRecorder: any;

  public mostrarVistaPrevia: boolean = false;
  public mostrarFormEditar: boolean = false; 

  private batallaInterrumpida = false;

  public intervaloContadorGrabadora;

  public tiempoGrabacion;

  public modoFreestyleLocalStorage;

  public modoFreestyle = "Palabras";

  public palabras;		
  public palabrasGrabacion:any = new Array();
  
  public intervaloPalabras;
  public tiempoCambio:number = 10000;

  public imagenes;
  public imagenAleatoria;
  public imagenesGrabacion:any = new Array();

  public grabacionGuardada = false;

  public publication: Publication;


  //VOLUMEN GRABACION
  value: number = 5;
  valueVoz: number = 5;

  options: Options = {
    showSelectionBar: true,
    floor: 0,
    ceil: 10
  };
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
    private _beatService:BeatService,
    private _grabacionService:GrabacionService,
    private _palabrasService:PalabrasService,
    private _imagenesService:ImagenesService,
    private _publicationService: PublicationService,
  ){
  	this.titulo = 'Ver batalla';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
    if(this.identity){
      this.grabacion = new Grabacion("","","","","","","","",0,"","","","","","","",this.identity._id,"","");
      this.audioGrabacion= new AudioGrabacion("", this.identity._id, "", "", "");
    }else {
        this.grabacion = new Grabacion("","","","","","","","",0,"","","","","","","","","","");
        this.audioGrabacion= new AudioGrabacion("", "", "", "", "");
    }

    if(this.identity){
			this.publication = new Publication("", "", "", "", "", "", "","", "", "", "", this.identity._id);
		} else {
			this.publication = new Publication("", "", "", "", "", "", "","", "", "", "", "");
		}
  }

  recibirBeat(event):void{
    this.beat = event.beat;
    alert(this.beat._id);
  }

    ngOnInit(){
        GLOBAL.DEBUG && console.log('grabadora-free-palabras.component cargado');
        this.cargarPagina();

        this.modoFreestyleLocalStorage = localStorage.getItem("modoFreestyle");

        GLOBAL.DEBUG && console.log(this.modoFreestyleLocalStorage);
        if(this.modoFreestyleLocalStorage){
          this.seleccionarModoFreestyle(this.modoFreestyleLocalStorage);
        } else {
          this.seleccionarModoFreestyle('Palabras');
        }


        $(".footer").css("display", "none");
        
        this.beatLocalStorage = JSON.parse(localStorage.getItem("beat_seleccionado"));


        $(".menu-modo-grabadora").css("display", "flex");

        //Mi dropdown
        $(window).click(function(event:any){
          if (!event.target.matches('.btn-mi-dropdown div')) {
            var dropdowns = document.getElementsByClassName("menu-mi-dropdown");
            var that = this;
            var i;
            for (i = 0; i < dropdowns.length; i++) {
              var openDropdown = dropdowns[i];
              if (openDropdown.classList.contains('activo')) {
                openDropdown.classList.remove('activo');
                that.activarDesactivarDropdown = false;

              }
            }				
          }
        });
        
    }


    ngOnDestroy(){
      clearInterval(this.intervaloContadorGrabadora);
      clearInterval(this.intervaloPalabras);    
    }

    cargarPagina(){
        this._route.params.subscribe(params => {  
            this.cargarGrabadora();
        });
    }

    public videoActivado = true;

    activarDesactivarVideo(accion){
      if(accion == 'activar') {
        this.videoActivado = true;
  
        $("#video-no").removeClass('activo');
        $("#video-si").addClass('activo');
  
        this.cargarGrabadora();
      }
      if(accion == 'desactivar') {
        this.videoActivado = false;
  
        $("#video-si").removeClass('activo');
        $("#video-no").addClass('activo');
        this.cargarGrabadora();
      } 
    }

    cargarGrabadora(){
      var canvas : any = document.querySelector('.visualizer');
      var mainSection : any = document.querySelector('.visualizador-voz-grabadora');
      // visualiser setup - create web audio api context and canvas
      var audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
      var canvasCtx = canvas.getContext("2d");
  
      if (navigator.mediaDevices.getUserMedia) {
        const onSuccess = stream => {
          
            this.mediaRecorder = new MediaRecorder(stream);
            visualize(stream);

            let preview = (document.getElementById("preview")as any);
            preview.volume = 0;

            preview.srcObject = stream;
            preview.captureStream = preview.captureStream || preview.mozCaptureStream;
  
  
            var that = this;
            // Al parar de grabar  
            this.mediaRecorder.onstop = e => {
                const audio:any = document.getElementById("grabacion"); 
                let blob;
                if(this.videoActivado == true) {
                  blob = new Blob(this.chunks, { 'type': 'video/webm' });
                } else if(that.videoActivado == false) {
                  blob = new Blob(this.chunks, { 'type': 'audio/*' });
                }
                
                this.chunks.length = 0;
                var blobURL = window.URL.createObjectURL(blob);

                audio.src = blobURL;
  
                var blobToBase64 = function(blob, cb) {
                  var reader = new FileReader();
                  reader.onload = function() {
                    var dataUrl = reader.result;
                    var base64 = (dataUrl as any).split(',')[1];
                    cb(base64);
                  };
                  reader.readAsDataURL(blob);
                };
  
                blobToBase64(blob, function(base64){ // encode
                  var update = {'audio': base64};
    
                  that.audioGrabacion.grabacionBase64 = update.audio;
                  var unix = Math.round(+new Date()/1000);    
                  that.audioGrabacion.nombreArchivo = that.identity._id+"-"+unix;
                  GLOBAL.DEBUG && console.log(that.audioGrabacion);
                });
            
            };
  
            this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
          };
  
          const onError = err => {
            alert("debes conectar un microfono");
          };
  
          navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

          var that = this;
          if(that.videoActivado == true) {
            navigator.getUserMedia({ audio: true, video: true}, onSuccess, onError, e => console.log(e));
          } else if(that.videoActivado == false) {
            navigator.getUserMedia({ audio: true}, onSuccess, onError, e => console.log(e));
          }
  
      } else {
        console.log('getUserMedia not supported on your browser!');
      }
  
      function visualize(stream) {
        var source = audioCtx.createMediaStreamSource(stream);
  
        var analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
  
        source.connect(analyser);
        //analyser.connect(audioCtx.destination);
  
        draw()
  
        function draw() {
          var WIDTH = canvas.width
          var HEIGHT = canvas.height;
  
          requestAnimationFrame(draw);
  
          analyser.getByteTimeDomainData(dataArray);
  
          canvasCtx.fillStyle = 'rgb(255, 255, 255)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'red';
  
          canvasCtx.beginPath();
  
          var sliceWidth = WIDTH * 1.0 / bufferLength;
          var x = 0;
  
  
          for(var i = 0; i < bufferLength; i++) {
       
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;
  
            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
  
            x += sliceWidth;
          }
  
          canvasCtx.lineTo(canvas.width, canvas.height/2);
          canvasCtx.stroke();
  
        }
      }
    }

    mostrarPalabrasGrabacion() { 
        var that = this;  
  
        var contenedorPalabras = document.querySelector(".palabras-grabadora");
        var divPalabra:any = document.createElement("div");
        
        divPalabra.className = 'palabra-grabadora';
        contenedorPalabras.appendChild(divPalabra);
  
        var palabraInicial = this.palabras[Math.floor(Math.random() * (this.palabras.length))];
        //añadir palabra ALEATORIA INICIAL a array de palabras de la grabacion
        that.palabrasGrabacion.push(palabraInicial);
  
        $(".palabras-grabadora .palabra-grabadora").text(palabraInicial);
  
        that.intervaloPalabras = setInterval(function() {
          var palabraAleatoria = that.palabras[Math.floor(Math.random() * (that.palabras.length))];
          
          //añadir PALABRA ALEATORIA a array de palabras de la grabacion
          that.palabrasGrabacion.push(palabraAleatoria);
  
          $(".palabras-grabadora .palabra-grabadora").text(palabraAleatoria);
        }, that.tiempoCambio);
    }


    imagenesEntreno() {     

      this.crearImagenAleatoria();
      var that = this;
  
      this.intervaloPalabras = setInterval(function() {
  
        that.crearImagenAleatoria();
        
      }, that.tiempoCambio);
    }

    getImagenes(){
      this._imagenesService.getImagenes().subscribe(
        response => {
          if(response.hits){
            this.imagenes = response.hits;
            GLOBAL.DEBUG && console.log(this.imagenes)
          }else{
            this.status = 'error';
          }
        },
        error => {
          var errorMessage = <any>error;
          GLOBAL.DEBUG && console.log(errorMessage);
  
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

        this.imagenAleatoria = this.imagenes[num];
        this.imagenesGrabacion.push(this.imagenAleatoria.largeImageURL);
        
        this.totalImgUsadas++;   
        
        if(this.totalImgUsadas === this.imagenes.length){ //Una vez mostradas todas las imagenes, reinicia numerosAleatoriosSalidos y totalImgUsadas a 0        
          this.numerosAleatoriosSalidos = [];
          this.totalImgUsadas = 0;
        }
      }

    }
    
    public grabar() {
      this.grabacionGuardada = false;
      this.grabando = true;
      this.mostrarVistaPrevia = false;
      
      this.mediaRecorder.start();
      this.iniciarReproductor();
      this.contador();

      this.palabrasGrabacion = [];
      this.imagenesGrabacion = [];
      this.numerosAleatoriosSalidos = [];
      this.palabraActual = "";
      this.imagenActual = "";

      if(this.modoFreestyle == 'Palabras') {
        this.mostrarPalabrasGrabacion();
      } else if(this.modoFreestyle == 'Imagenes') {
        this.imagenesEntreno();
      }
      
      
      $("#tiempo_grabadora").css("display", "inline-block");

      $(".menu-modo-grabadora").css({display:'none'});
    }
  
    public pararDeGrabar() {
      this.grabando = false;
      this.mostrarVistaPrevia = true;
      this.mediaRecorder.stop();
      this.pararReproductor();
      this.beatUsado = this.beat;

      this.generarDetallesFreestyle()

    
      
      clearInterval(this.intervaloContadorGrabadora);
      clearInterval(this.intervaloPalabras);

      var that = this;
      setTimeout(function(){
        that.playVistaPrevia();
      }, 300);
      setTimeout(function(){
        that.obtenerMiniatura();
      }, 400);
     
    }

    descartarGrabacion(){
      this.mostrarVistaPrevia = false;
      $(".menu-modo-grabadora").css({display:'flex'});
    }    

    contador(){
      var that = this;
      this.tiempoGrabacion = 0;
          
      this.intervaloContadorGrabadora = setInterval(function(){
          that.tiempoGrabacion++;
          that.formatearTiempo(that.tiempoGrabacion);
      },1000);			
    }

    formatearTiempo(segundos) {
      var minutos = (<any> Math.floor(segundos / 60));
      minutos = (minutos >= 10) ? minutos : "0" + minutos;
      segundos = Math.floor(segundos % 60);
      segundos = (segundos >= 10) ? segundos : "0" + segundos;

      if(minutos + ":" + segundos == this.beat.duration){
        alert("FIN");
        this.pararDeGrabar();
        this.pararReproductor();
      }
  
      $("#contador_grabadora").html(minutos + ":" + segundos);
      this.tiempoGrabado = minutos + ":" + segundos;
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

    // GUARDAR FREESTYLE (GRABACION)
    guardar(){
      this.mostrarFormEditar = true;
      $("#panel-grabadora").css("display", "none");

      GLOBAL.DEBUG && console.log(this.audioGrabacion);

      var base64 = this.audioGrabacion.grabacionBase64;
      var nArchivo = this.audioGrabacion.nombreArchivo;

      GLOBAL.DEBUG && console.log(this.audioGrabacion.grabacionBase64);
      GLOBAL.DEBUG && console.log(this.audioGrabacion.nombreArchivo);

      this.guardarAudioGrabacion(base64,nArchivo);
      this.guardarGrabacion(nArchivo);
    }

    guardarAudioGrabacion(base64, nArchivo){
      var miObjeto = (new Object()as any);
      miObjeto.grabacionBase64 = base64;
      miObjeto.nombreArchivo = nArchivo;
      GLOBAL.DEBUG && console.log(miObjeto);
      
      this._grabacionService.guardarAudioGrabacion(this.token,miObjeto).subscribe(
        response => {
          if(response.grabacionAudio){
            this.status = 'success';
            this.mostrarVistaPrevia = false;

            alert("Grabacion guardada");
          } else {
            this.status = 'error';
            GLOBAL.DEBUG && console.log("error");              
          }
        },
        error => {
          var errorMessage = <any>error;
          GLOBAL.DEBUG && console.log(errorMessage);
        }
      );
    }

    
    guardarGrabacion(nombreArchivoGrabacion){
      GLOBAL.DEBUG && console.log(this.grabacion);
      

      this.grabacion.tipo = "Freestyle";
      this.grabacion.modo = this.modoFreestyle;

      if(this.modoFreestyle != 'Libre') {
        this.grabacion.tiempoCambio = this.tiempoCambio;
      } else {
        this.grabacion.tiempoCambio = null;
      }

      
      if(this.usandoImagenDePerfil == true) {
        this.grabacion.imagen = 'null';
      } else {
        this.grabacion.imagen = this.miniaturaGrabacion.nombreArchivoImagen;
      }

      this.grabacion.audio = nombreArchivoGrabacion+".wav";
      this.grabacion.tiempoGrabacion = this.tiempoGrabacion;
      this.grabacion.beat = this.beat._id;
      this.grabacion.estado = "Público";

      if(this.modoFreestyle == 'Palabras') {
        this.grabacion.palabras = this.palabrasGrabacion.toString();
      }

      if(this.modoFreestyle == 'Imagenes') {
        GLOBAL.DEBUG && console.log(this.imagenesGrabacion);
        this.grabacion.palabras = this.imagenesGrabacion.toString();
      }

      if(this.modoFreestyle == 'Libre') this.grabacion.palabras = null;

      this.grabacion.volumenBeat = this.volumenBeatGrabacion;
      this.grabacion.volumenVoz = this.volumenVozGrabacion;
      GLOBAL.DEBUG && console.log(this.grabacion);

      this._grabacionService.addGrabacion(this.token, this.grabacion).subscribe(
        response => {
          GLOBAL.DEBUG && console.log(response)
          if(response.grabacion){
            // GRABACION GUARDADA
            this.grabacion = response.grabacion;

            alert("Grabacion guardada");
            this.grabacionGuardada = true;

            
            
            
            // this.guardarMiniatura(); // Falta corregir error, no guarda bien la miniatura del canvas

            this.crearPublicacion('freestyle', response.grabacion._id);
          }else{
            this.status = 'error';
          }
        },
        error => {
          var errorMessage = <any>error;
          GLOBAL.DEBUG && console.log(errorMessage);
  
          if(errorMessage != null){
            this.status = 'error';
          }
        }
      );
    }

    public pasoActualGuardar = 'paso1'
    cambiarPasoGuardar(paso){
      this.pasoActualGuardar = paso;
      $(".pasos-guardar-freestyle").addClass(paso);
    }

    generarDetallesFreestyle(){
      var fecha = new Date();
      
      var diaSemana = fecha.getDay();
      var numDiaMes = fecha.getDate();
      var mes = fecha.getMonth()+1;
      var año = fecha.getFullYear();

      var semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

      var fechaFinal = semana[diaSemana] + ", " + numDiaMes+ "/" + mes + "/" + año;

      var numeroFreestyle = "";

      if(this.modoFreestyle == 'Libre') this.tiempoCambio = null;

      this._grabacionService.getNumGrabacionesUsuarioConMismosParametros(this.token,this.modoFreestyle, this.tiempoCambio).subscribe(
        response => {
          if(response.total){
            numeroFreestyle = " ["+((response.total)+1) + "]";
            
          }

          if(this.modoFreestyle == 'Libre')  {
            this.grabacion.nombre = this.identity.nick + ' freestyle ' + this.modoFreestyle + ' ' + numeroFreestyle;
            this.grabacion.descripcion = this.identity.nick + ' improvisando en modo ' + this.modoFreestyle + '  el ' + fechaFinal + ' con una base de ' + this.beatUsado.style.charAt(0).toUpperCase() + this.beatUsado.style.slice(1).replace('-', ' ');
          }else {
            this.grabacion.nombre = this.identity.nick + ' ' + this.modoFreestyle + ' cada ' + this.tiempoCambio / 1000 + 's' + numeroFreestyle;
            this.grabacion.descripcion = this.identity.nick + ' improvisando en Rapdise con ' + this.modoFreestyle + ' aleatorias cada ' + this.tiempoCambio / 1000 + ' segundos el ' + fechaFinal + ' con una base de ' + this.beatUsado.style.charAt(0).toUpperCase() + this.beatUsado.style.slice(1).replace('-', ' ');
          } 
        },
        error => {
          var errorMessage = <any>error;
          GLOBAL.DEBUG && console.log(errorMessage);
  
          if(errorMessage != null){
            this.status = 'error';
          }
        }
      )
     
    }

    activarDesactivarDropdownPrivacidad(){
      document.getElementById("menu-dropdown-visiblidad").classList.toggle("activo");
    }

    

    // VISTA PREVIA
    formatearTiempoVistaPrevia(segundos) {
      var minutos = (<any> Math.floor(segundos / 60));
      minutos = (minutos >= 10) ? minutos : "0" + minutos;
      segundos = Math.floor(segundos % 60);
      segundos = (segundos >= 10) ? segundos : "0" + segundos;

      $("#tiempo-reproductor-vista-previa span").html(minutos + ":" + segundos);
    }


    ajustarVolumen(volumenDe){
      GLOBAL.DEBUG && console.log(this.value);
      GLOBAL.DEBUG && console.log(this.valueVoz);

      var audio = (<any>document.getElementById("grabacion"));
      var beat = (<any>document.getElementById("beat_grabacion"));

      // if(volumenDe == 'voz'){
      //   if(this.valueVoz == 10){
      //     this.value = 0;
      //   } else if(this.valueVoz == 9){
      //     this.value = 1;
      //   } else if(this.valueVoz == 8){
      //     this.value = 2;
      //   } else if(this.valueVoz == 7){
      //     this.value = 3;
      //   } else if(this.valueVoz == 6){
      //     this.value = 4;
      //   } else if(this.valueVoz == 5){
      //     this.value = 5;
      //   } else if(this.valueVoz == 4){
      //     this.value = 6;
      //   } else if(this.valueVoz == 3){
      //     this.value = 7;
      //   }  else if(this.valueVoz == 2){
      //     this.value = 8;   
      //   } else if(this.valueVoz == 1){
      //     this.value = 9;    
      //   } else if(this.valueVoz == 0){
      //     this.value = 10;     
      //   }

      // } if(volumenDe == 'beat'){
      //   if(this.value == 10){
      //     this.valueVoz = 0;
      //   } else if(this.value == 9){
      //     this.valueVoz = 1;
      //   } else if(this.value == 8){
      //     this.valueVoz = 2;
      //   } else if(this.value == 7){
      //     this.valueVoz = 3;
      //   } else if(this.value == 6){
      //     this.valueVoz = 4;
      //   } else if(this.value == 5){
      //     this.valueVoz = 5;
      //   } else if(this.value == 4){
      //     this.valueVoz = 6;
      //   } else if(this.value == 3){
      //     this.valueVoz = 7;
      //   } else if(this.value == 2){
      //     this.valueVoz = 8;   
      //   } else if(this.value == 1){
      //     this.valueVoz = 9;    
      //   } else if(this.value == 0){
      //     this.valueVoz = 10;     
      //   } 
      // }

      audio.volume = this.valueVoz / 10;
      beat.volume = this.value / 10;

      this.volumenVozGrabacion = audio.volume;
      this.volumenBeatGrabacion = beat.volume;

      
    }

    public palabraActual = "";
    mostrarPalabrasVistaPrevia(numSegundos){

      var segundosCambio = this.tiempoCambio / 1000; // tiempoCambio viene en milisegundos: 10.000 = 10s, 5.000 = 5s ....etc

      var indexPalabraVistaPrevia = Math.floor(numSegundos / segundosCambio);

      this.palabraActual = this.palabrasGrabacion[indexPalabraVistaPrevia];

      this.formatearTiempoVistaPrevia(numSegundos);

      GLOBAL.DEBUG && console.log(this.palabraActual);
    }

    public imagenActual = "";
    mostrarImagenesVistaPrevia(numSegundos){

      var segundosCambio = this.tiempoCambio / 1000; // tiempoCambio viene en milisegundos: 10.000 = 10s, 5.000 = 5s ....etc

      var indexImagenVistaPrevia = Math.floor(numSegundos / segundosCambio);

      this.imagenActual = this.imagenesGrabacion[indexImagenVistaPrevia];

      this.formatearTiempoVistaPrevia(numSegundos);

      GLOBAL.DEBUG && console.log(this.imagenActual);
    }

    reproductorVistaPrevia() {
      var videoGrabacion = (<any>document.getElementById("grabacion"));
      var beat = (<any>document.getElementById("beat_grabacion"));
      var that = this;

      videoGrabacion.volume = this.valueVoz / 10;
      beat.volume = this.value / 10;

      this.volumenVozGrabacion = videoGrabacion.volume;
      this.volumenBeatGrabacion = beat.volume;
  
      beat.ontimeupdate = function () {
        var percentage = (beat.currentTime / that.tiempoGrabacion) * 100;
        $(".barra-reproductor-vista-previa .barra").css("width", percentage + "%");

        
        if(that.modoFreestyle == 'Palabras') that.mostrarPalabrasVistaPrevia(Math.round(beat.currentTime));
        if(that.modoFreestyle == 'Imagenes') that.mostrarImagenesVistaPrevia(Math.round(beat.currentTime));

        
        
        if(beat.currentTime >= that.tiempoGrabacion){
          $(".botones-reproductor-vista-previa .fa-pause").addClass("display-none");
          $(".botones-reproductor-vista-previa .fa-play").removeClass("display-none");


          
          if(!that.mostrarFormEditar){
            // (document.getElementById("grabacion") as any).load();      
            (document.getElementById("beat_grabacion") as any).load(); 
          }
              
        }

        
        
      };
  
      beat.onplaying = function () {
        that.sonando = true;

      }
  
      beat.onpause = function () {
        that.sonando = false;
      }

      videoGrabacion.onended = function() {
        
      }
  
      $(".barra-reproductor-vista-previa").on("click", function (e) {
        
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $(".barra-reproductor-vista-previa").width();
        var percentage = (left / totalWidth);
        var grabacionTime = that.tiempoGrabacion * percentage;
        beat.currentTime = grabacionTime;
        videoGrabacion.currentTime = grabacionTime;

        
      });//click()
    }

    public minutosMiniatura = "00";
    public segundosMiniatura = "01";
    

    cambiarSegundosMiniatura(){
      var beat = (<any>document.getElementById("beat_grabacion"));
      var videoGrabacion = (<any>document.getElementById("grabacion"));
      
      var minutosInput = Number(this.minutosMiniatura)
      var segundosInput = Number(this.segundosMiniatura);

      var totalSegundos = 0;
      totalSegundos += minutosInput*60;
      totalSegundos += segundosInput;

      if(totalSegundos > this.tiempoGrabacion){
        alert("¡El valor introducido es más grande que la duración de la grabación!");
      } else {
        beat.currentTime = totalSegundos;
        videoGrabacion.currentTime = totalSegundos;
        var that = this;
        setTimeout(function(){
          that.obtenerMiniatura();
        }, 300);
        
      }

    }
    
    public urlMiniatura;
    public dataUrlMiniatura;
    obtenerMiniatura(){
      var videoGrabacion = (<any>document.getElementById("grabacion"));
      var canvas = (document.querySelector("#canvas-element") as any);

      

      var imgCanvas = (document.querySelector("#img-canvas-miniatura") as any);

      // Set canvas dimensions same as video dimensions
      canvas.width = videoGrabacion.videoWidth;
      canvas.height = videoGrabacion.videoHeight;

      imgCanvas.width = videoGrabacion.videoWidth;
      imgCanvas.height = videoGrabacion.videoHeight;

      var canvas_ctx = canvas.getContext("2d");

      // // Placing the current frame image of the video in the canvas
      canvas_ctx.drawImage(videoGrabacion, 0, 0, canvas.width, canvas.height);

      var fecha = (new Date()).toISOString()
      var fechaUnix = Math.round(+new Date()/1000);

      this.dataUrlMiniatura = canvas.toDataURL();
      this.miniaturaGrabacion.archivoImagen = this.dataUrlMiniatura;
      this.miniaturaGrabacion.nombreArchivoImagen = this.identity.nick+'-freestyle-'+fechaUnix+'.png';

      // De canvas a blob
      var that = this;
      canvas.toBlob(function(blob) {
        that.urlMiniatura = URL.createObjectURL(blob);
        imgCanvas.style.background = 'url('+ that.urlMiniatura +')';

        $("#miniatura-final").attr("src", that.dataUrlMiniatura);
      });
    }

    public usandoImagenDePerfil = false;
    imagenPerfilComoMiniatura(event){
      var img = $("#img-canvas-miniatura");


      this.usandoImagenDePerfil = event.target.checked;

      if(this.usandoImagenDePerfil == true){
        alert("ahora es true");
        img.css("background", "url(" +this.url+'get-image-user/'+ this.identity.image + ")");
      }
        

      GLOBAL.DEBUG && console.log(this.usandoImagenDePerfil);
      
    }

    

    public miniaturaGrabacion:any = {
      "nombreArchivoImagen": "",
      "archivoImagen": ""
    }
    guardarMiniatura(){
      this._grabacionService.guardarMiniaturaGrabacion(this.token, this.miniaturaGrabacion).subscribe(
        response => {
          // miniatura guardada
        },
        error => {
          GLOBAL.DEBUG && console.log(error);
        }
      )
    }

    playVistaPrevia(){
      $(".botones-reproductor-vista-previa .fa-play").addClass("display-none");
      $(".botones-reproductor-vista-previa .fa-pause").removeClass("display-none");
      
      (document.getElementById("grabacion") as any).play();      
      (document.getElementById("beat_grabacion") as any).play();

      this.reproductorVistaPrevia();
    }

    pauseVistaPrevia(){
      $(".botones-reproductor-vista-previa .fa-pause").addClass("display-none");
      $(".botones-reproductor-vista-previa .fa-play").removeClass("display-none");   

      (document.getElementById("grabacion") as any).pause();      
      (document.getElementById("beat_grabacion") as any).pause();
    }

    playPauseVistaPrevia(){
      var that = this;
      if (this.sonando){
        that.pauseVistaPrevia();
      } else if (this.sonando == false){
        that.playVistaPrevia();
      }
    }


    // SELECCION DEL MODO DEL FREESTYLE
    seleccionarModoFreestyle(modoFreestyle){
      localStorage.setItem('modoFreestyle', modoFreestyle);

      
      if(modoFreestyle == 'Imagenes'){
        this.getImagenes();
      }

      this.modoFreestyle = modoFreestyle;
    }

    // OPCIONES TIEMPO CAMBIO DE palabra,imagen, etc...
    elegirTiempoCambio(tiempoCambio){
      this.tiempoCambio = tiempoCambio;
      GLOBAL.DEBUG && console.log(tiempoCambio);

      $(".boton-tiempo-cambio").removeClass("active");

      if(tiempoCambio == 5000){
        $(".entreno-5s").addClass("active");
      }else if(tiempoCambio == 10000){
        $(".entreno-10s").addClass("active");
      }else if(tiempoCambio == 15000){
        $(".entreno-15s").addClass("active");
      }

      $("#entreno-tiempo-personalizado").removeClass("active");
      $("#input-editar-cambio").addClass("display-none");
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

    cambioPersonalizado(value){
      GLOBAL.DEBUG && console.log(value);

      var tiempoCambio = value * 1000;

      this.tiempoCambio = tiempoCambio;
      GLOBAL.DEBUG && console.log(this.tiempoCambio);      
    }

    crearPublicacion(tipo, idGrabacion){
      GLOBAL.DEBUG && console.log(this.publication);
      this.publication.tipo = tipo;
      this.publication.grabacion = idGrabacion;
      this._publicationService.addPublication(this.token, this.publication).subscribe(
        response => {
          if(response.publication){
            console.log(response.publication);
  

              this.status = 'success';
              GLOBAL.DEBUG && alert("publicacion de freestyle creada correctamente")
  
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
      );
    }

}
