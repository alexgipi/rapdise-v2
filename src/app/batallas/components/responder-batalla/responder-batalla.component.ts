import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/takeWhile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Batalla } from '../../../models/batalla';
import { AudioBatalla } from '../../../models/audio-batalla';
import { NotificacionBatalla } from '../../../models/notificacion-batalla';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { BeatService } from '../../../services/beat.service';
import { PalabrasService } from '../../../services/palabras.service';
import { NotificacionService } from '../../../services/notificacion.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'responder-batalla',
  templateUrl: 'responder-batalla.component.html',
  providers: [UserService, BatallaService, BeatService, PalabrasService, NotificacionService]
})
export class ResponderBatallaComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;

  public beat: Beat;

  public idBeat1Batalla:string;
  
  public batallas: Batalla[];
  public totalBatallas;

  public rondas;
  public tiempoRonda1;
  public tiempoRonda2;
  public tiempoRonda3;

  public modoBatalla;

  public batallando = false;
	public batallaEnMarcha = false;
	public batallaFinalizada = false;

  public palabras;		
  public palabrasBatalla = new Array();
  
  public intervalo;
  public duracionIntervalo = 10000;

  public batalla: Batalla;
  public audioBatalla: AudioBatalla;

	public isRecording: boolean = false;
  private chunks: any = [];
  private mediaRecorder: any;

  private batallaInterrumpida = false;
  public notificacionBatalla: NotificacionBatalla;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _userService:UserService,
    private _beatService:BeatService,
    private _batallaService:BatallaService,
    private _palabrasService:PalabrasService,
    private _notificacionService: NotificacionService
  ){
    this.titulo= 'Creador de Batallas';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
    this.batalla = new Batalla("", "", "", 2, "", "", "", 60, 60, 60, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","",this.identity._id,"","","","","","","","","","",3,"");
    this.audioBatalla = new AudioBatalla("", this.identity._id, "", "", "");
    this.notificacionBatalla = new NotificacionBatalla("", "", "", "", "", "");
  }

  ngOnInit(){
    console.log('nueva-batalla.component cargado');
    this.cargarPagina();
    this.cargarGrabadora();

    console.log(this.audioBatalla);
  }

  cargarPagina(){
      this._route.params.subscribe(params => {
          let idBatalla = params['idBatalla'];
          this.getBatalla(idBatalla, this.identity._id);
      });
  }

  public usuarioRespuesta:number;
  getBatalla(idBatalla, idUsuario){
    this._batallaService.getBatalla(idBatalla, idUsuario).subscribe(
      response => {
        if(!response.batalla){
            this._router.navigate(['/']);

        }else {
            this.batalla = response.batalla;
            console.log(this.batalla);

            if(this.identity && this.identity._id == response.batalla.usuario1._id) {
              this.usuarioRespuesta = 1;
              alert("Eres el usuario"+ this.usuarioRespuesta +" de la batalla");
            } else if (response.batalla.usuario2 && this.identity && this.identity._id == response.batalla.usuario2._id) {
              this.usuarioRespuesta = 2;
              alert("Eres el usuario"+ this.usuarioRespuesta +" de la batalla");
            } else {

              if (response.batalla.usuario2){
                this.usuarioRespuesta = null;
                alert("No participas en esta batalla, no puedes responder");
              } else {
                alert(response.batalla.usuario1.nick + " está esperando una respuesta.. ¿ Te atreves ?")
              }

              
            }
            
            this.idBeat1Batalla = response.batalla.base1._id;

            this.getBeat(this.idBeat1Batalla);

            // var stringPalabras = this.batalla.palabrasImpro1;
            // //añadir string de palaras a Array palabrasBatalla
            // this.palabrasBatalla = stringPalabras.split(',');
            // console.log(this.palabrasBatalla);

            this.rondas = response.batalla.rondas;
            this.modoBatalla = response.batalla.modoRonda1;

            this.tiempoRonda1 = response.batalla.tiempoTurnoRonda1;
            this.tiempoRonda2 = response.batalla.tiempoTurnoRonda2;
            if(response.batalla.tiempoTurnoRonda3 != null) this.tiempoRonda3 = response.batalla.tiempoTurnoRonda3;

            console.log("Rondas: "+this.rondas);
            console.log("Tiempo ronda1: "+this.tiempoRonda1);

            var urlAudioImpro = this.url + "get-audio-batalla/" + response.batalla.impro1;            
            document.getElementById("audio-impro1").setAttribute("src", urlAudioImpro);
           
             if(this.batalla.impro2 != null){
              document.getElementById("audio-impro2").setAttribute("src", urlAudioImpro);
            }

            if(this.batalla.impro3 != null){
              document.getElementById("audio-impro3").setAttribute("src", urlAudioImpro);
            }
            
            if(this.batalla.impro4 != null){
              document.getElementById("audio-impro4").setAttribute("src", urlAudioImpro);
            }            if(this.batalla.impro4 != null){
              document.getElementById("audio-impro4").setAttribute("src", urlAudioImpro);
            }
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

  startPlayer(beat){
		let beat_player = JSON.stringify(beat);
		let file_path = this.url + 'get-audio-beat/' + beat.file;

		let image_beat_path = this.url + 'get-imagen-beat/' + beat.image;
		// let image_user_path = this.url + 'get-image-user/' + beat.user.image;

		localStorage.setItem('beat_sonando', beat_player);

		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById("nombre-beat").innerHTML = beat.name;
		document.getElementById("autor-beat").innerHTML = beat.user.nick;
		document.getElementById("img-beat").setAttribute("src", image_beat_path);
  }
  
	cuentaAtras321(){
		$(".cuenta321-y-batallando").fadeIn();
		var that = this;

		var tiempo = 3;
		(document.getElementById("cuenta-321") as any).textContent = tiempo;
		var cuenta321 = setInterval(function(){
		tiempo--;

			if(tiempo == 3){
				console.log("3");
			}
			if(tiempo == 2){
				console.log("2");
			}
			if(tiempo == 1){
				console.log("1");
			}
			if(tiempo == 0){
				clearInterval(cuenta321);
        $(".panel-cuenta321").css("display", "none");
        $(".panel-batallando").css("display", "flex");
			}
			(document.getElementById("cuenta-321") as any).textContent = tiempo;
			if(tiempo <= 0)
				clearInterval(cuenta321);
		},1000);
}
  

  empezarBatalla() {
    this.batallaInterrumpida = false;
		(document.getElementById("player") as any).load();
    document.getElementById("mp3-source").setAttribute("src", this.url+"get-audio-beat/"+this.idBeat1Batalla+"");
    
		this.cuentaAtras321();
		
    var that = this;
    
		setTimeout( function(){
      that.startPlayer(that.beat);
			that.empezarBatallaPalabras();
      that.cuentaAtras();
      that.grabar();

      $(".boton-parar-batalla").on("click", function(){
        that.batallaInterrumpida = true;
      });
    }, 3000 );
    
	}

  empezarBatallaPalabras() {
      var that = this;

			this.batallando = true;
			this.batallaEnMarcha = true;

			var barraProgreso = document.querySelector(".barra-progreso-entreno .barra");
			var bar = new ProgressBar.Line(barraProgreso, {duration: that.duracionIntervalo,color: '#37abc8',trailColor: '#eee',svgStyle: {width: '100%', height: '15px', borderRadius:'10px'}});

			var contenedorPalabras = document.querySelector(".contenedor-palabras");
			var divPalabra:any = document.createElement("div");
			divPalabra.className = 'palabra';
			contenedorPalabras.appendChild(divPalabra);

			bar.animate(1);
			var palabraInicial = this.palabras[Math.floor(Math.random() * (this.palabras.length))];
			//añadir palabra aleatoria inicial a array de palabras de la batalla
			that.palabrasBatalla.push(palabraInicial);

			$(".contenedor-palabras .palabra").text(palabraInicial);

			that.intervalo = setInterval(function() {
				bar.set(0);
				bar.animate(1);
				var palabraAleatoria = that.palabras[Math.floor(Math.random() * (that.palabras.length))];
				
				//añadir palabraAleatoria a array de palabras de la batalla
				that.palabrasBatalla.push(palabraAleatoria);
				console.log(that.palabrasBatalla);

				$(".contenedor-palabras .palabra").text(palabraAleatoria);
			}, that.duracionIntervalo);
  }

  cuentaAtras(){
			var that = this;

      var timeleft;  //CONTROLAR TIEMPO CUENTA ATRAS DE LA RONDA SEGÚN Impros
      if(this.batalla.impro1 != null && this.batalla.impro2 == null) timeleft = this.tiempoRonda1;

      if(this.batalla.impro2 != null && this.batalla.impro3 == null) timeleft = this.tiempoRonda2;
      if(this.batalla.impro3 != null && this.batalla.impro4 == null) timeleft = this.tiempoRonda2;

      if(this.batalla.impro4 != null && this.batalla.impro5 == null) timeleft = this.tiempoRonda3;
      if(this.batalla.impro5 != null && this.batalla.impro6 == null) timeleft = this.tiempoRonda3;
			
			(document.getElementById("countdowntimer") as any).textContent = timeleft;
	    var downloadTimer = setInterval(function(){
      timeleft--;
      
				if(timeleft == 0){
          that.finalizarBatalla();
					clearInterval(downloadTimer);
				}
	    (document.getElementById("countdowntimer") as any).textContent = timeleft;
	    if(timeleft <= 0)
					clearInterval(downloadTimer);
			},1000);
			
			
			$(".boton-parar-batalla").on("click", function(){
	    	clearInterval(downloadTimer);
	    	(document.getElementById("countdowntimer") as any).textContent = that.tiempoRonda1;
	    });
	}
	
	pararBatalla(){
    this.pararDeGrabar();
    $(".panel-cuenta321").css("display", "flex");
    $(".panel-batallando").css("display", "none");
		$(".cuenta321-y-batallando").fadeOut();


      this.batallaEnMarcha = false;
      this.palabrasBatalla = [];
		
		
    this.batallando = false;
    if (this.intervalo) {
       clearInterval(this.intervalo);
		}
		
    $(".barra-progreso-entreno .barra").empty();
	}

	finalizarBatalla(){
    this.pararDeGrabar();
		$(".panel-cuenta321").css("display", "flex");
    $(".panel-batallando").css("display", "none");
    $(".cuenta321-y-batallando").fadeOut();
    
		this.batallando = false;
    if (this.intervalo) {
       clearInterval(this.intervalo);
		}		
    $(".contenedor-palabras").empty();
		$(".barra-progreso-entreno .barra").empty();
		
    //Eliminar ULTIMA palabra sobrante de array de palabrasBatalla. (1Ronda: Hay 7 y deben ser 6, || 2 Rondas: hay 13 y deben ser 12)
    this.palabrasBatalla.pop();
		console.log(this.palabrasBatalla);
		this.batallaEnMarcha = false;
    this.batallaFinalizada = true;
  }
  
  public videoActivado:boolean = true;
  
  cargarGrabadora(){
    var canvas : any = document.querySelector('.visualizer');
    var mainSection : any = document.querySelector('.visualizador-voz-batalla');
    // visualiser setup - create web audio api context and canvas
    var audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    var canvasCtx = canvas.getContext("2d");

    if (navigator.mediaDevices.getUserMedia) {
      const onSuccess = stream => {
          $(".alerta-microfono-encontrado").css("display","inline-block");
        
          this.mediaRecorder = new MediaRecorder(stream);
          visualize(stream);

          let preview = (document.getElementById("preview")as any);
          preview.volume = 0;

          preview.srcObject = stream;
          preview.captureStream = preview.captureStream || preview.mozCaptureStream;


          var that = this;

          // Al parar de grabar  
          this.mediaRecorder.onstop = e => {

            // Si se ha interrumpido(parado) la batalla no hace nada
            if(this.batallaInterrumpida == true){
              alert("BATALLA Interrumpida TRUE");
              alert("No hago nada");
            }else {
              alert("BATALLA Interrumpida False");
              alert("Batalla Finalizada, puedo guardar!");              
              
              let blob;
              if(this.videoActivado == true) {
                blob = new Blob(this.chunks, { 'type': 'video/webm' });
              } else if(that.videoActivado == false) {
                blob = new Blob(this.chunks, { 'type': 'audio/*' });
              }

              this.chunks.length = 0;
              var blobURL = window.URL.createObjectURL(blob);
              alert(blobURL);

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
  
                that.audioBatalla.grabacionBase64 = update.audio;
                var unix = Math.round(+new Date()/1000);    
                that.audioBatalla.nombreArchivo = that.identity._id+"-"+unix;
                console.log(that.audioBatalla);
                

                //Guardar grabacion

                if(that.videoActivado == true){
                  that.guardarAudioBatalla(that.audioBatalla.grabacionBase64, that.audioBatalla.nombreArchivo+'.webm');            
                } 
                if(that.videoActivado == false) {
                  that.guardarAudioBatalla(that.audioBatalla.grabacionBase64, that.audioBatalla.nombreArchivo+'.wav');      
                }
                
                //Aplicar valores a editar y MODIFICAR BATALLA

                if(that.batalla.usuario2 == null){
                  that.batalla.nombre = that.batalla.nombre + " VS " + that.identity.nick;
                  that.batalla.usuario2 = that.identity._id;
                }

                if(that.batalla.rondas == 2){
                  if(that.batalla.impro1 && that.batalla.impro2 == null){
                    if(that.videoActivado == true) that.batalla.impro2 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro2 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro2 = that.palabrasBatalla.join();
                    that.batalla.estado = "En marcha";

                  }else if(that.batalla.impro2 && that.batalla.impro3 == null){
                    if(that.videoActivado == true) that.batalla.impro3 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro3 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro3 = that.palabrasBatalla.join();
  
                  }else if(that.batalla.impro3 && that.batalla.impro4 == null){
                    if(that.videoActivado == true) that.batalla.impro4 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro4 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro4 = that.palabrasBatalla.join();
                    that.batalla.estado = "Finalizada";
                  }

                } else if(that.batalla.rondas == 3){
                  if(that.batalla.impro1 && that.batalla.impro2 == null){
                    if(that.videoActivado == true) that.batalla.impro2 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro2 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro2 = that.palabrasBatalla.join();
                    that.batalla.estado = "En marcha";

                  }else if(that.batalla.impro2 && that.batalla.impro3 == null){
                    if(that.videoActivado == true) that.batalla.impro3 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro3 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro3 = that.palabrasBatalla.join();
  
                  }else if(that.batalla.impro3 && that.batalla.impro4 == null){
                    if(that.videoActivado == true) that.batalla.impro4 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro4 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro4 = that.palabrasBatalla.join();
 
                  } else if(that.batalla.impro4 && that.batalla.impro5 == null){
                    if(that.videoActivado == true) that.batalla.impro5 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro5 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro5 = that.palabrasBatalla.join();

                  } else if(that.batalla.impro5 && that.batalla.impro6 == null){
                    if(that.videoActivado == true) that.batalla.impro6 = that.audioBatalla.nombreArchivo+".webm";
                    if(that.videoActivado == false) that.batalla.impro6 = that.audioBatalla.nombreArchivo+".wav";
                    that.batalla.palabrasImpro6 = that.palabrasBatalla.join();
                    that.batalla.estado = "Finalizada";
                  }

                }
                
                that.modificarBatalla(that.batalla);
              });

            }
          
          };

          this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
        };

        const onError = err => {
          $(".alerta-no-microfono").css("display","inline-block"); 
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

    window.onresize = function() {
      canvas.width = mainSection.offsetWidth;
    }
  }
  
  activarDesactivarVideo(accion){
    if(accion == 'activar') {
      this.videoActivado = true;

      $("#video-no").removeClass('active');
      $("#video-si").addClass('active');

      this.cargarGrabadora();
    }
    if(accion == 'desactivar') {
      this.videoActivado = false;

      $("#video-si").removeClass('active');
      $("#video-no").addClass('active');
      this.cargarGrabadora();
    } 
  }
	
	public grabar() {
    this.isRecording = true;
    this.mediaRecorder.start();
  }

  public pararDeGrabar() {
    this.isRecording = false;
    this.mediaRecorder.stop();
  }

  guardarAudioBatalla(base64, nArchivo){
    var miObjeto = (new Object()as any);
    miObjeto.grabacionBase64 = base64;
    miObjeto.nombreArchivo = nArchivo;
    console.log(miObjeto);
    
    this._batallaService.guardarAudioBatalla(this.token,miObjeto).subscribe(
      response => {
        if(response.audioBatalla){
          this.status = 'success';
          alert("Grabacion Guardada");
        } else {
          this.status = 'error';
          console.log("error");              
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  modificarBatalla(batalla){
    
    this._batallaService.modificarBatalla(this.token, batalla).subscribe(
      response => {
        if(response.batalla){
          console.log(response.batalla);
          alert("batalla editada");

          if(this.batalla.rondas == 2){
            alert("2 rondas")
            
            if(this.batalla.impro2 != null && this.batalla.impro3 == null){
              this.crearNotificacion(batalla._id,batalla.usuario1._id,this.identity.nick + " te ha contestado");
                           
            }else if(this.batalla.impro3 != null && this.batalla.impro4 == null){
              this.crearNotificacion(batalla._id,batalla.usuario2._id,batalla.usuario1.nick + " te ha contestado");
            }else if(this.batalla.impro4 != null){
              alert("Noti para usuario1")
              this.crearNotificacion(batalla._id,batalla.usuario1._id,batalla.usuario2.nick + " te ha contestado y ha concluido la batalla.");           
              //Finalizar Batalla
            }
          }

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

  crearNotificacion(idBatalla,idUsuario,textoNotificacion){
    //CREAR NOTIFICACION				
    this._notificacionService.guardarNotificacionBatalla(this.token,idBatalla,idUsuario,textoNotificacion).subscribe(
      response => {
        if(response.notificacion){
          console.log(response.notificacion);
          alert("Noti creada");
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

}
