import { Component, OnInit, EventEmitter,Input, OnChanges, SimpleChanges, SimpleChange  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { Batalla } from '../../../models/batalla';
import { AudioBatalla } from '../../../models/audio-batalla';
import { NotificacionBatalla } from '../../../models/notificacion-batalla';

//Servicios
import { UserService } from '../../../services/user.service';
import { BatallaService } from '../../../services/batalla.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { PalabrasService } from '../../../services/palabras.service';

import { UploadService } from '../../../services/upload.service';
import { GLOBAL } from '../../../services/global';

declare const ProgressBar: any;

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
  selector: 'modal-responder-batalla',
  templateUrl: './modal-responder-batalla.component.html',
  providers: [UserService, BatallaService,UploadService, NotificacionService, PalabrasService]
})

export class ModalResponderBatallaComponent implements OnChanges, OnInit {
	@Input() batallaSeleccionada;
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;

	public reproduciendo:boolean = false;

	public palabrasGrabacion:any = new Array();
	public imagenesGrabacion:any = new Array();
	public palabraActual = "";

	public beatSeleccionado:Beat;

	public imagenActual = "";

	// GRABACION DE RESPUESTA

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

	public grabando: boolean = false;
	private chunks: any = [];
	private mediaRecorder: any;

	private grabacionInterrumpida = false;
	public notificacionBatalla: NotificacionBatalla;

	public tocaGrabarImpro = 2;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _batallaService: BatallaService,
		private _palabrasService:PalabrasService,
		private _notificacionService: NotificacionService,
		private _uploadService: UploadService

	){
		this.titulo = 'Modal responder batalla';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.palabras = this._palabrasService.getPalabras();
		if(this.identity){
			this.batalla = new Batalla("", "", "", 2, "", "", "", 60, 60, 60, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","",this.identity._id,"","","","","","","","","","",3,"");
		} else {
			this.batalla = new Batalla("", "", "", 2, "", "", "", 60, 60, 60, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","","","","","","","","","","","","",3,"");
		}

		if(this.identity) {
			this.audioBatalla = new AudioBatalla("", this.identity._id, "", "", "");
		} else {
			this.audioBatalla = new AudioBatalla("", "", "", "", "");
		}
		this.notificacionBatalla = new NotificacionBatalla("", "", "", "", "", "");
	}
	ngOnInit(){
		console.log('Componente modal-responder-batalla cargado');
		var that = this;
		$(".ofuscador-modal").on("click", function(){
			$(".modal-responder-batalla").removeClass("abierto");
			that.pauseFreestyle();
			var videoGrabacion = (<any>document.getElementById("impro-usuario1"));
			var beat = (<any>document.getElementById("audio-beat"));

			videoGrabacion.load();
			beat.load();

			that.cerrarPanelGrabarRespuesta();
		});
	}
	
	public numUsuarioQueGraba;
	ngOnChanges(changes: SimpleChanges) {
		
    
		const batallaSeleccionada: SimpleChange = changes.batallaSeleccionada;
		console.log('valor anterior: ', batallaSeleccionada.previousValue);
		console.log('valor actual: ', batallaSeleccionada.currentValue);
		this.batallaSeleccionada = batallaSeleccionada.currentValue;

		if(this.batallaSeleccionada != undefined){
			this.palabrasGrabacion = this.batallaSeleccionada.palabrasImpro1.split(',');
			console.log(this.palabrasGrabacion);
			this.beatSeleccionado = this.batallaSeleccionada.base1;

			
		
			if(this.identity && this.identity._id == this.batallaSeleccionada.usuario1._id) {
				this.numUsuarioQueGraba = 1;
				alert("Eres el usuario"+ this.numUsuarioQueGraba +" de la batalla, no puedes responderte a ti mismo...");
			} else if (this.batallaSeleccionada.usuario2 && this.identity && this.identity._id == this.batallaSeleccionada.usuario2._id) {
				this.numUsuarioQueGraba = 2;
				alert("Eres el usuario"+ this.numUsuarioQueGraba +" de la batalla");

				if(this.batallaSeleccionada.impro2 == null){
					this.tocaGrabarImpro = 2;
				} else if (this.batallaSeleccionada.impro2 != null && this.batallaSeleccionada.impro3 == null){
					this.tocaGrabarImpro = 3;
				}
			} else {
				if (this.batallaSeleccionada.usuario2){
					this.numUsuarioQueGraba = null;
					alert("No participas en esta batalla, no puedes responder");
				} else {
					alert(this.batallaSeleccionada.usuario1.nick + " está esperando una respuesta.. ¿ Te atreves ?");
				}
			}
		}
	}
		  
	

	
	// REPRODUCCION DE LA RONDA DEL RIVAL A RESPONDER ////////////////////////////////////////////
	public escuchandoRival = false;
	reproductorFreestyle() {
		var videoGrabacion = (<any>document.getElementById("impro-usuario1"));
		var beat = (<any>document.getElementById("audio-beat"));
		
		var that = this;
	
		beat.ontimeupdate = function () {
		  var percentage = (beat.currentTime / that.batallaSeleccionada.tiempoTurnoRonda1) * 100;
		  $(".tiempo-actual-barra-player").css("width", percentage + "%");

		  that.mostrarTiempoActual(Math.round(beat.currentTime)); 
	
		  
		  if(that.batallaSeleccionada.modoRonda1 == 'palabras') that.mostrarPalabrasFreestyle(Math.round(beat.currentTime));
		  if(that.batallaSeleccionada.modoRonda1 == 'imagenes') that.mostrarImagenesFreestyle(Math.round(beat.currentTime));
	
		  
		  
		  if(beat.currentTime >= that.batallaSeleccionada.tiempoTurnoRonda1){
			alert("Fin del beat de la ronda1 del usuario 1");
			(document.getElementById("audio-beat") as any).load(); 
				
		  }
		  
		  
		};
	
		beat.onplaying = function () {
		  that.escuchandoRival = true;
	
		}
	
		beat.onpause = function () {
		  that.escuchandoRival = false;
		}
	
		videoGrabacion.onended = function() {
			that.escuchandoRival = false;
		  	alert("Fin de la ronda1 del usuario 1");
			videoGrabacion.load(); 
		}
	
		$(".contenedor-barra-player").on("click", function (e) {
		  
		  var offset = $(this).offset();
		  var left = (e.pageX - offset.left);
		  var totalWidth = $(".contenedor-barra-player").width();
		  var percentage = (left / totalWidth);
		  var grabacionTime = that.batallaSeleccionada.tiempoTurnoRonda1 * percentage;
		  beat.currentTime = grabacionTime;
		  videoGrabacion.currentTime = grabacionTime;
	
		  
		});//click()
	}

	playFreestyle(){
        
		this.reproductorFreestyle();
		console.log((document.getElementById("impro-usuario1") as any));
		(document.getElementById("impro-usuario1") as any).play();      
		(document.getElementById("audio-beat") as any).play();
		this.escuchandoRival = true;
	}

	pauseFreestyle(){
		(document.getElementById("impro-usuario1") as any).pause();      
		(document.getElementById("audio-beat") as any).pause();
		this.escuchandoRival = false;
	}

	playPauseFreestyle(){
		if (this.escuchandoRival){
			this.pauseFreestyle();
		} else {
			this.playFreestyle();
		}
	}

	formatearSegundos(tiempo){
		tiempo = Math.round(tiempo);

		var minutos = Math.floor(tiempo / 60);
		var segundos = (tiempo - minutos * 60 as any);
		
		segundos = segundos < 10 ? '0' + segundos : segundos;

		return minutos + ":" + segundos;
	}


	public tiempoActualFormateado = '00:00';
	mostrarTiempoActual(segundos) {
		var minutos = (<any> Math.floor(segundos / 60));
		minutos = (minutos >= 10) ? minutos : "0" + minutos;
		segundos = Math.floor(segundos % 60);
		segundos = (segundos >= 10) ? segundos : "0" + segundos;

		this.tiempoActualFormateado = minutos + ":" + segundos;
	}

	mostrarPalabrasFreestyle(numSegundos){

		var segundosCambio = 10 // tiempoCambio viene en milisegundos: 10.000 = 10s, 5.000 = 5s ....etc

		var indexPalabraFreestyle = Math.floor(numSegundos / segundosCambio);

		console.log(this.palabrasGrabacion);

		this.palabraActual = this.palabrasGrabacion[indexPalabraFreestyle];

		console.log(this.palabraActual);
	}

	
	mostrarImagenesFreestyle(numSegundos){
  
	  var segundosCambio = 10 // tiempoCambio viene en milisegundos: 10.000 = 10s, 5.000 = 5s ....etc
  
	  var indexImagenFreestyle = Math.floor(numSegundos / segundosCambio);
  
	  this.imagenActual = this.imagenesGrabacion[indexImagenFreestyle];
  
	  console.log(this.imagenActual);
	}



	// GRABACION DE LA RESPUESTA ////////////////////////////////////////////

	public panelGrabarRespuestaAbierto = false;

	abrirCerrarPanelGrabarRespuesta(){
		if(this.panelGrabarRespuestaAbierto == false){
			$(".panel-modal-grabar-respuesta").addClass("activo");
			this.panelGrabarRespuestaAbierto = true;
			this.pauseFreestyle();
		} else {
			$(".panel-modal-grabar-respuesta").removeClass("activo");
			this.panelGrabarRespuestaAbierto = false;
		}

		this.cargarGrabadora();
		
	}

	cerrarPanelGrabarRespuesta(){

		$(".panel-modal-grabar-respuesta").removeClass("activo");
		this.panelGrabarRespuestaAbierto = false;
		this.cargarGrabadora();
	}

	cuentaAtras321(){
		var that = this;

		$(".contador-3-2-1").fadeIn();
		var tiempo = 3;
		(document.querySelector(".contador-3-2-1") as any).textContent = tiempo;

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
				$(".contador-3-2-1").fadeOut();
			}

			if(tiempo == 0) {
				(document.querySelector(".contador-3-2-1") as any).textContent = 'YA!';
			} else {
				(document.querySelector(".contador-3-2-1") as any).textContent = tiempo;
			}

			if(tiempo <= 0) clearInterval(cuenta321);
		},1000);
	}

	startPlayer(beat){
		let beat_player = JSON.stringify(beat);

		(document.getElementById("audio-beat") as any).load();
		(document.getElementById("audio-beat") as any).play();
  	}
  

  	empezarGrabacion() {
    	this.grabacionInterrumpida = false;
    
		this.cuentaAtras321();
		
		
   		 var that = this;
    
		setTimeout( function(){
			that.startPlayer(this.beat);
			
			that.grabar();
			that.empezarBatallaPalabras();
			that.cuentaAtras();
			
			

			$(".boton-parar-batalla").on("click", function(){
				that.grabacionInterrumpida = true;
			});
    	}, 3000 );
	}

  	empezarBatallaPalabras() {
      	var that = this;

		this.batallando = true;
		this.batallaEnMarcha = true;

		var contenedorPalabras = document.querySelector(".contenedor-palabras-respuesta");
		contenedorPalabras.innerHTML = "";

		var divPalabra:any = document.createElement("div");
		divPalabra.className = 'palabra';
		contenedorPalabras.appendChild(divPalabra);

		var palabraInicial = this.palabras[Math.floor(Math.random() * (this.palabras.length))];
		//añadir palabra aleatoria inicial a array de palabras de la batalla
		that.palabrasBatalla.push(palabraInicial);

		$(".contenedor-palabras-respuesta .palabra").text(palabraInicial);

		that.intervalo = setInterval(function() {
			var palabraAleatoria = that.palabras[Math.floor(Math.random() * (that.palabras.length))];
			
			//añadir palabraAleatoria a array de palabras de la batalla
			that.palabrasBatalla.push(palabraAleatoria);
			console.log(that.palabrasBatalla);

			$(".contenedor-palabras-respuesta .palabra").text(palabraAleatoria);
		}, that.duracionIntervalo);
  	}

  	cuentaAtras(){
		var that = this;

		var timeleft;  //CONTROLAR TIEMPO CUENTA ATRAS DE LA RONDA SEGÚN Impros
		if(this.batallaSeleccionada.impro1 != null && this.batallaSeleccionada.impro2 == null) timeleft = this.batallaSeleccionada.tiempoTurnoRonda1;

		if(this.batallaSeleccionada.impro2 != null && this.batallaSeleccionada.impro3 == null) timeleft = this.batallaSeleccionada.tiempoTurnoRonda2;
		if(this.batallaSeleccionada.impro3 != null && this.batallaSeleccionada.impro4 == null) timeleft = this.batallaSeleccionada.tiempoTurnoRonda2;
		
		$("#countdowntimer").css("display", "flex");
		(document.getElementById("countdowntimer") as any).textContent = timeleft;

	    var downloadTimer = setInterval(function(){
      		timeleft--;
      
			if(timeleft == 0){
				  that.finalizarBatalla();
				  $("#countdowntimer").fadeOut();
				clearInterval(downloadTimer);
			}
	    	(document.getElementById("countdowntimer") as any).textContent = timeleft;
	    	if(timeleft <= 0)clearInterval(downloadTimer);
		},1000);
			
			
		$(".boton-parar-batalla").on("click", function(){
	    	clearInterval(downloadTimer);
	    	(document.getElementById("countdowntimer") as any).textContent = that.tiempoRonda1;
	    });
	}
	
	pararGrabacion(){
    	this.pararDeGrabar();
    	$(".panel-cuenta321").css("display", "flex");
    	$(".panel-batallando").css("display", "none");
		$(".cuenta321-y-batallando").fadeOut();

		
		
		this.grabando = false;
		if (this.intervalo) {
       		clearInterval(this.intervalo);
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
		
		//Eliminar ULTIMA palabra sobrante de array de palabrasBatalla. (1Ronda: Hay 7 y deben ser 6, || 2 Rondas: hay 13 y deben ser 12)
		this.palabrasBatalla.pop();
		console.log(this.palabrasBatalla);
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
				if(this.grabacionInterrumpida == true){
				alert("Grabacion Interrumpida TRUE");
				alert("No hago nada");
				}else {
				alert("Grabacion Interrumpida False");
				alert("Grabacion Finalizada, puedo guardar!");              
				
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

					if(that.batallaSeleccionada.usuario2 == null){
						that.batallaSeleccionada.nombre = that.batallaSeleccionada.nombre + " VS " + that.identity.nick;
						that.batallaSeleccionada.usuario2 = that.identity._id;
					}

					if(that.batallaSeleccionada.rondas == 2 || that.batallaSeleccionada.rondas == 3){
						if(that.tocaGrabarImpro == 2){
							if(that.videoActivado == true) that.batallaSeleccionada.impro2 = that.audioBatalla.nombreArchivo+".webm";
							if(that.videoActivado == false) that.batallaSeleccionada.impro2 = that.audioBatalla.nombreArchivo+".wav";
							that.batallaSeleccionada.palabrasImpro2 = that.palabrasBatalla.join();
							that.batallaSeleccionada.estado = "En marcha";
						} else if(that.tocaGrabarImpro == 3){
							if(that.videoActivado == true) that.batallaSeleccionada.impro3 = that.audioBatalla.nombreArchivo+".webm";
							if(that.videoActivado == false) that.batallaSeleccionada.impro3 = that.audioBatalla.nombreArchivo+".wav";
							that.batallaSeleccionada.palabrasImpro3 = that.palabrasBatalla.join();
							that.batallaSeleccionada.estado = "En marcha";
						}
					}
					
					console.log(that.batallaSeleccionada);
					that.modificarBatalla(that.batallaSeleccionada);
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
		this.palabrasBatalla = [];
		this.grabando = true;
		this.mediaRecorder.start();
  	}

	public pararDeGrabar() {
		this.grabando = false;
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
		console.log("modificarBatalla:", batalla);
		
		this._batallaService.modificarBatalla(this.token, batalla).subscribe(
		response => {
			if(response.batalla){
				console.log(response.batalla);
				alert("batalla editada");

				if(this.batallaSeleccionada.rondas == 2 || this.batallaSeleccionada.rondas == 3){
					alert(this.batallaSeleccionada.rondas + " rondas")
					
					if(this.batallaSeleccionada.impro2 != null && this.batallaSeleccionada.impro3 == null){

						alert("// Usuario 2 ha respondido la 1ª Ronda, le toca responder la 2º Ronda");
						
						this.tocaGrabarImpro = 3;
						alert("toca grabar parte " + this.tocaGrabarImpro);
						this.beatSeleccionado = this.batallaSeleccionada.base2;
						alert("beat cambiado a: " + this.beatSeleccionado.name);

								
					}else if(this.batallaSeleccionada.impro3 != null && this.batallaSeleccionada.impro4 == null){
						this.tocaGrabarImpro = 4;
						this.crearNotificacion(batalla._id,batalla.usuario1._id,this.identity.nick + " te ha contestado");
						// Usuario 2 ha respondido la 2ª Ronda, le toca responder al Usuario 1 para finalizar la batalla
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
