import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/takeWhile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Batalla } from '../../../models/batalla';
import { AudioBatalla } from '../../../models/audio-batalla';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { BeatService } from '../../../services/beat.service';
import { PalabrasService } from '../../../services/palabras.service';

import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'nueva-batalla',
  templateUrl: 'nueva-batalla.component.html',
  providers: [UserService, BatallaService, BeatService, PalabrasService]
})
export class NuevaBatallaComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;
  public users: User[];
  public follows;

  public beats: Beat[];
  public beat: Beat;
  public totalBeats;

  public idBeat1:string;
  public idBeat2:string;
  public idBeat3:string;

  public indexCarruselBeats = 1;
  public moverPixelsCarrusel = 0;
  
  public batallas: Batalla[];
  public totalBatallas;

  public rondas = 2;

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

  public batallaCreada:boolean = false;
  public escuchandoBatallaCreada:boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _userService:UserService,
    private _beatService:BeatService,
    private _batallaService:BatallaService,
    private _palabrasService:PalabrasService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.palabras = this._palabrasService.getPalabras();
		this.batalla = new Batalla("", "", "", 2, "palabras", "palabras", "", 60, 60, 60, "no", "no", "", "no", "no", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","",this.identity._id,"","","","","","","","","","",3,"");
  	this.titulo= 'Creador de Batallas';
    this.url = GLOBAL.url;

    this.audioBatalla = new AudioBatalla("", this.identity._id, "", "", "");
  }

  playBatallaCreada(){
    this.escuchandoBatallaCreada = true;
    let audio = (document.getElementById("audio-batalla-creada")as any);
    let beat = (document.getElementById("beat-batalla-creada")as any);
    audio.play();
    beat.play();
  }

  pauseBatallaCreada(){
    this.escuchandoBatallaCreada = false;
    let audio = (document.getElementById("audio-batalla-creada")as any);
    let beat = (document.getElementById("beat-batalla-creada")as any);
    audio.pause();
    beat.pause();
  }

  setVolumenBase(value) {
    let beat = (document.getElementById("beat-batalla-creada")as any);
    beat.volume = value/100;
  }

  setVolumenVoz(value) {
    let voz = (document.getElementById("audio-batalla-creada")as any);
    voz.volume = value/100;
  }

  ngOnDestroy(){
    $("body").removeClass("body-fondo-crear-batalla");
  }

  ngOnInit(){
    console.log('nueva-batalla.component cargado');

		this.getBeatsPorEstilo("todos");
    this.cargarGrabadora();
    this.reproductor();

    console.log(this.audioBatalla);
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

          this.idBeat1 = this.beats['0']._id;
          this.idBeat2 = this.beats['1']._id;
          this.idBeat3 = this.beats['2']._id;

          this.getBeat(this.idBeat1, false);

					$(".items-carrusel-seleccion-beat .flex").css("width", this.totalBeats * 233.07 + 453.58);

          console.log(this.beats);
          console.log("Total: " + this.totalBeats);
          console.log("Id's Primeros 3 beats: "+this.idBeat1+' /// ' + this.idBeat2+' /// ' + this.idBeat3);        
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

  getBeat(id, iniciarReproductor){
    this._beatService.getBeat(id).subscribe(
      response => {
        if(!response.beat){
          this._router.navigate(['/']);

        }else {
          this.beat = response.beat;
          if(iniciarReproductor == true){
            this.startPlayer(this.beat);
          }
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

		document.getElementById("player-beat-crear-batalla").setAttribute("src", file_path);
		(document.getElementById("player-beat-crear-batalla") as any).load();
		(document.getElementById("player-beat-crear-batalla") as any).play();

		document.getElementById("nombre-beat").innerHTML = beat.name;
		document.getElementById("autor-beat").innerHTML = beat.user.nick;
		document.getElementById("img-beat").setAttribute("src", image_beat_path);

		$(".fa-play-circle-o").removeClass('fa-volume-up');
		$(".notification-icon").removeClass('icono-pause');
		$("#bloqueador-"+beat._id+" span").toggleClass('fa-volume-up');
	}

  cambiarRondasBatalla(numRondas){
    this.rondas = numRondas;
    this.batalla.rondas = numRondas;
    $(".cambiar-rondas-batalla .btn").removeClass("active");
    $(".cambiar-rondas-batalla #rondas-"+numRondas).addClass("active");

    if(numRondas == 3){
      // Establecer normas por defecto al seleccionar 3ª Ronda
      this.cambiarTiempoRonda(3, 60);
      this.cambiarModoRonda(3, 'palabras');
      this.cambiarSangreRonda(3, 'no');
      this.cambiarAcapellaRonda(3, 'no');
    }
  }
  
  cambiarTiempoRonda(numRonda,tiempoRonda){
    console.log(numRonda,tiempoRonda)
    this.batalla.tiempoTurnoRonda1 = tiempoRonda;

    if(numRonda == 1) {
      this.batalla.tiempoTurnoRonda1 = tiempoRonda;

    }
    if(numRonda == 2) this.batalla.tiempoTurnoRonda2 = tiempoRonda;
    if(numRonda == 3) this.batalla.tiempoTurnoRonda3 = tiempoRonda;

    $(".cambiar-tiempo-ronda"+numRonda+ " .btn").removeClass("active");
    $("#tiempo-"+numRonda+"-"+tiempoRonda).addClass("active");
  }

  cambiarModoRonda(numRonda, modoRonda){
    console.log(numRonda,modoRonda)

    

    if(numRonda == 1){
      this.batalla.modoRonda1 = modoRonda;
    }
    if(numRonda == 2) this.batalla.modoRonda2 = modoRonda;
    if(numRonda == 3) this.batalla.modoRonda3 = modoRonda;

    $(".cambiar-modo-ronda"+numRonda+ " .btn").removeClass("active");
    $("#modo-"+numRonda+"-"+modoRonda).addClass("active");
  }

  cambiarSangreRonda(numRonda,sangreRonda){ 
    console.log(numRonda,sangreRonda)
    if(numRonda == 1) {
      this.batalla.sangreRonda1 = sangreRonda;

    }
    if(numRonda == 2) this.batalla.sangreRonda2 = sangreRonda;
    if(numRonda == 3) this.batalla.sangreRonda3 = sangreRonda;

    $(".cambiar-sangre-ronda"+numRonda+ " .btn").removeClass("active");
    $("#sangre-"+numRonda+"-"+sangreRonda).addClass("active");
  }

  cambiarAcapellaRonda(numRonda, acapellaRonda){
    console.log(numRonda,acapellaRonda)
    if(numRonda == 1) {
      this.batalla.acapellaRonda1 = acapellaRonda;
    }
    if(numRonda == 2) this.batalla.acapellaRonda2 = acapellaRonda;
    if(numRonda == 3) this.batalla.acapellaRonda3 = acapellaRonda;

    $(".cambiar-acapella-ronda"+numRonda+ " .btn").removeClass("active");
    $("#acapella-"+numRonda+"-"+acapellaRonda).addClass("active");
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
    document.getElementById("mp3-source").setAttribute("src", this.url + "get-audio-beat/"+this.idBeat1+"");
    
		this.cuentaAtras321();
		
    var that = this;
    
		setTimeout( function(){
			that.getBeat(that.idBeat1, true);
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
			var bar = new ProgressBar.Line(barraProgreso, {duration: that.duracionIntervalo,color: '#ff6f42',trailColor: '#eee',svgStyle: {width: '100%', height: '15px', borderRadius:'10px'}});

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

			var timeleft = that.batalla.tiempoTurnoRonda1;
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
	    	(document.getElementById("countdowntimer") as any).textContent = this.batalla.tiempoTurnoRonda1;
	    });
	}
	
	pararBatalla(){
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
  public videoActivado:boolean = true;

  cargarGrabadora(){
    var canvas : any = document.querySelector('.visualizer');
    var mainSection : any = document.querySelector('.visualizador-voz-batalla');
    // visualiser setup - create web audio api context and canvas
    var audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    var canvasCtx = canvas.getContext("2d");

    if (navigator.mediaDevices.getUserMedia) {
      const onSuccess = stream => {        
        var audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
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
              alert("Batalla Finalizada, puedo guardar!");

              this.batallaCreada = true;

              let blob;
              if(this.videoActivado == true) {
                blob = new Blob(this.chunks, { 'type': 'video/webm' });
              } else if(that.videoActivado == false) {
                blob = new Blob(this.chunks, { 'type': 'audio/*' });
              }
              this.chunks.length = 0;
              var blobURL = window.URL.createObjectURL(blob);

              setTimeout(function(){
                let audio = (document.getElementById("audio-batalla-creada")as any);
                let beat = (document.getElementById("beat-batalla-creada")as any);
                audio.src = blobURL;
                beat.src = that.url + 'get-audio-beat/' + that.beat.file; 
              }, 200);          


              var blobToBase64 = function(blob, cb) {
                var reader = new FileReader();
                reader.onload = function() {
                  var dataUrl = reader.result;
                  var base64 = (dataUrl as string).split(',')[1];
                  cb(base64);
                };
                reader.readAsDataURL(blob);
              };

              blobToBase64(blob, function(base64){ // encode
                var update = {'video': base64};
  
                that.audioBatalla.grabacionBase64 = update.video;
                var unix = Math.round(+new Date()/1000);    
                that.audioBatalla.nombreArchivo = that.identity._id+"-"+unix;
                console.log(that.audioBatalla);
  
                //Guardar grabacion
                if(that.videoActivado == true){
                  that.guardarAudioBatalla(that.audioBatalla.grabacionBase64, that.audioBatalla.nombreArchivo+'.webm');
                  that.guardarBatalla(that.audioBatalla.nombreArchivo+'.webm');
                } 
                if(that.videoActivado == false) {
                  that.guardarAudioBatalla(that.audioBatalla.grabacionBase64, that.audioBatalla.nombreArchivo+'.wav');
                  that.guardarBatalla(that.audioBatalla.nombreArchivo+'.wav');
                }
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

      $("#video-no").removeClass('activo');
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

  guardarBatalla(nombreArchivoImpro1){

    this.batalla.nombre = this.identity.nick;
    this.batalla.rondas = this.rondas;

    this.batalla.visibilidad = 'publico';
    this.batalla.tiempoMaxRespuesta = 5;

    this.batalla.palabrasImpro1 = this.palabrasBatalla.toString();

    this.batalla.base1 = this.idBeat1;
    this.batalla.base2 = this.idBeat2;
    this.batalla.base3 = this.idBeat3;

    this.batalla.impro1 = nombreArchivoImpro1;

    if(this.rondas == 2){
      this.batalla.sangreRonda3 = null;

      this.batalla.acapellaRonda3 = null;

      this.batalla.tiempoTurnoRonda3 = null;

      this.batalla.modoRonda3 = null;

    }

    

    console.log(this.batalla);

		this._batallaService.guardarBatalla(this.token,this.batalla).subscribe(
      response => {
        if(response.batalla){
          console.log(response.batalla);
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

  recibirBeat(event):void{
    this.beat = event.beat;
    alert(this.beat._id + " ID")
  }

  selecionarBeat(ronda,beat){
    this.beat = beat;

    if(ronda == 1) this.idBeat1 = this.beat._id;
    if(ronda == 2) this.idBeat2 = this.beat._id;
    if(ronda == 3) this.idBeat3 = this.beat._id;

  }

  public sonando = false;
  reproductor(){
    var beatPlayer = (document.getElementById("player-beat-crear-batalla") as any);
    var that = this;
    beatPlayer.onplaying = function(){
      that.sonando = true;
    }
  }

 playBeat(beat){

    if(this.sonando == false) this.startPlayer(beat);
    
    // this.selecionarBeat(beat);
  }

}
