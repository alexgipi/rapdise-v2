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
  selector: 'batalla-vs',
  templateUrl: 'batalla-vs.component.html',
  providers: [UserService, BatallaService, BeatService, PalabrasService, NotificacionService]
})
export class BatallaVSComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
	public status:string;
	public user: User;
  public users: User[];
  public follows;

  public beats: Beat[];
  public beat: Beat;
  public totalBeats;
  public primerBeat;
  public idBeat1:string;

  public indexCarruselBeats = 1;
  public moverPixelsCarrusel = 0;
  
  public batallas: Batalla[];
  public totalBatallas;

  public rondas = 1;
  public tiempoRonda = 60;
  public modoBatalla = "palabras";
  public intentosRonda = 1;
  public intentosRondaRestantes = 1;

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
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
		this.batalla = new Batalla("", "", "", 2, "", "", "", 60, 60, 60, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","",this.identity._id,"","","","","","","","","","",3,"");
  	this.titulo= 'Creador de Batallas';
    this.url = GLOBAL.url;

		this.audioBatalla = new AudioBatalla("", this.identity._id, "", "", "");
		this.notificacionBatalla = new NotificacionBatalla("", "", "", "", "", "");
  }

  ngOnInit(){
		console.log('nueva-batalla.component cargado');
		this.loadPage();
		this.getBeatsPorEstilo("todos");
    this.cargarGrabadora();

    console.log(this.audioBatalla);
	}
	
	loadPage(){
		this._route.params.subscribe(params => {
			let nick = params['nick'];
			this.getUser(nick);
		});
	}

	getUser(nick){
		this._userService.getUser(nick).subscribe(
			response => {
				if(response.user){
					console.log(response);
					this.user = response.user;

				}else {
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
				this._router.navigate([this.identity.nick,'muro']);
			}
		);
	}

  getBeatsPorEstilo(estilo){
    $(".filtro-seleccion-beat li").removeClass("active");
    var estilo = estilo;
    $("#boton-"+estilo).addClass("active");
    this.indexCarruselBeats = 1;
    this.moverPixelsCarrusel = 0;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + 0 +"px, 0px, 0px)");

    this._beatService.getBeatsEstilo(estilo, this.identity._id).subscribe(
      response => {
        if(!response.beats){
          this.status = 'error';
        }else {
          this.beats = response.beats;
          this.totalBeats = response.total;

          this.primerBeat = this.beats['0'];
          this.idBeat1 = this.primerBeat._id;

          this.getBeat(this.idBeat1);

					$(".items-carrusel-seleccion-beat .flex").css("width", this.totalBeats * 233.07 + 453.58);

          console.log(this.beats);
          console.log("Total: " + this.totalBeats);
          console.log(this.idBeat1);        
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
    this.moverPixelsCarrusel = this.moverPixelsCarrusel + 203.07;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");

    this.indexCarruselBeats = this.indexCarruselBeats + 1;

    $(".item-carrusel-seleccion-beat").removeClass("active");
    $(".beat-carrusel"+this.indexCarruselBeats).addClass("active");

    var valueIdBeat = $(".beat-carrusel"+this.indexCarruselBeats).attr("value");
    this.idBeat1 = valueIdBeat;

    this.getBeat(this.idBeat1);
  }

  carruselPrev(){
    this.moverPixelsCarrusel = this.moverPixelsCarrusel - 203.07;
    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");

    this.indexCarruselBeats = this.indexCarruselBeats - 1;
         
    $(".item-carrusel-seleccion-beat").removeClass("active");
    $(".beat-carrusel"+this.indexCarruselBeats).addClass("active");

    var valueIdBeat = $(".beat-carrusel"+this.indexCarruselBeats).attr("value");
    this.idBeat1 = valueIdBeat;

    this.getBeat(this.idBeat1);
  }

  carruselComprobarIndex(){
		if(this.indexCarruselBeats == 0) {
		  this.indexCarruselBeats = this.totalBeats;
		  this.moverPixelsCarrusel = this.indexCarruselBeats * 203.07 - 203.07;
		  $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");
		} else if(this.indexCarruselBeats > this.totalBeats) {
		    this.indexCarruselBeats = 1;
		    this.moverPixelsCarrusel = this.indexCarruselBeats * 203.07 - 203.07;
		    $(".items-carrusel-seleccion-beat .flex").css("transform", "translate3d(-" + this.moverPixelsCarrusel +"px, 0px, 0px)");
		}
  }

  getBeat(id){
    this._beatService.getBeat(id).subscribe(
      response => {
        if(!response.beat){
          this._router.navigate(['/']);

        }else {
          this.beat = response.beat;
          this.startPlayer(this.beat);
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

		$(".fa-play-circle-o").removeClass('fa-volume-up');
		$(".notification-icon").removeClass('icono-pause');
		$("#bloqueador-"+beat._id+" span").toggleClass('fa-volume-up');
	}

  cambiarRondasBatalla(numRondas){
    this.rondas = numRondas;
    $(".cambiar-rondas-batalla .btn").removeClass("active");
    $(".cambiar-rondas-batalla #rondas-"+numRondas).addClass("active");
  }
  
  cambiarTiempoRonda(tiempoRonda){
    this.tiempoRonda = tiempoRonda;
    $(".cambiar-tiempo-ronda-batalla .btn").removeClass("active");
    $(".cambiar-tiempo-ronda-batalla #tiempo-ronda-"+tiempoRonda).addClass("active");
  }

  cambiarModoBatalla(modoBatalla){
    this.modoBatalla = modoBatalla; 
    $(".cambiar-modo-batalla .btn").removeClass("active");
    $(".cambiar-modo-batalla #modo-"+modoBatalla).addClass("active");
  }

  cambiarIntentosBatalla(intentosRonda){
    this.intentosRonda = intentosRonda;
		this.intentosRondaRestantes = intentosRonda;
		console.log('Intentos x ronda: ',this.intentosRonda);
		console.log('Intentos restantes: ', this.intentosRondaRestantes);
    $(".cambiar-intentos-batalla .btn").removeClass("active");
    $(".cambiar-intentos-batalla #intentos-"+intentosRonda).addClass("active");
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
    document.getElementById("mp3-source").setAttribute("src", "http://46.101.206.206/api/get-audio-beat/"+this.idBeat1+"");
    
		this.cuentaAtras321();
		
    var that = this;
    
		setTimeout( function(){
			that.getBeat(that.idBeat1);
			that.empezarBatallaPalabras();
      that.cuentaAtras();
      that.grabar();

      $(".boton-parar-batalla").on("click", function(){
        that.batallaInterrumpida = true;
      });
    }, 3000 );
    
	}

	empezarBatallaPalabras() {
		if(this.intentosRondaRestantes >= 1){
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
  }

  cuentaAtras(){
			var that = this;

			var timeleft = that.tiempoRonda;
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
	    	(document.getElementById("countdowntimer") as any).textContent = this.tiempoRonda;
	    });
	}
	
	pararBatalla(){
    this.pararDeGrabar();
    $(".panel-cuenta321").css("display", "flex");
    $(".panel-batallando").css("display", "none");
		$(".cuenta321-y-batallando").fadeOut();
		if(this.rondas == 1){
			if(this.intentosRonda == 1){
				this.batallaEnMarcha = false;
				this.palabrasBatalla = [];
				this.calcularIntentos();
			}

			if (this.intentosRonda == 2){
				this.palabrasBatalla = [];
				this.calcularIntentos();
			}

			if (this.intentosRonda == 3){
				this.palabrasBatalla = [];
				this.calcularIntentos();				
			}
		}
		
    this.batallando = false;
    if (this.intervalo) {
       clearInterval(this.intervalo);
		}
		
    $(".contenedor-palabras").empty();
    $(".barra-progreso-entreno .barra").empty();
	}
	
	calcularIntentos(){
		if(this.intentosRondaRestantes < 1){
			alert("No te quedan intentos")		
		} else {
			this.intentosRondaRestantes = this.intentosRondaRestantes-1;

			alert("Has parado la batalla, te quedan " + this.intentosRondaRestantes + " intentos.");
		}
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
		
		//Eliminar ULTIMA palabra de array de palabras de batalla
		this.palabrasBatalla.pop();
		console.log(this.palabrasBatalla);
		this.batallaEnMarcha = false;
    this.batallaFinalizada = true;
	}
  
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

              const blob = new Blob(this.chunks, { 'type': 'audio/*' });
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
                that.guardarAudioBatalla(that.audioBatalla.grabacionBase64, that.audioBatalla.nombreArchivo);
                that.guardarBatalla(that.audioBatalla.nombreArchivo);
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

        navigator.getUserMedia({ audio: true }, onSuccess, onError, e => console.log(e));
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

  guardarBatalla(nombreArchivoImpro1){
		var nombre = this.identity.nick + " VS " + this.user.nick;
		var modo = this.modoBatalla;
		var rondas = this.rondas;
		var duracion = this.tiempoRonda;
		var intentosRonda = this.intentosRonda;
		var palabrasRonda1 = this.palabrasBatalla.toString();
		var base1 = this.idBeat1;
		var impro1 = nombreArchivoImpro1+".wav";
		var usuario2 = this.user._id;

		console.log(nombre);
		console.log(modo);
		console.log(rondas);
		console.log(duracion);
		console.log(intentosRonda);
		console.log(palabrasRonda1);
		console.log(base1);
		console.log(impro1);
		console.log(usuario2);		
		
		this._batallaService.addBatallaDesafiar(this.token,nombre,modo,rondas,duracion,intentosRonda,palabrasRonda1,base1,impro1,usuario2).subscribe(
      response => {
        if(response.batalla){
					var batalla = response.batalla;
					console.log(batalla);
					
					//CREAR NOTIFICACION				
					this._notificacionService.guardarNotificacionBatalla(this.token,batalla._id,usuario2,this.identity.nick + " te ha desafiado a una batalla.").subscribe(
						response => {
							if(response.notificacion){
								console.log(response.notificacion);
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
