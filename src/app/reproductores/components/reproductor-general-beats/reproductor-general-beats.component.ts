import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { User } from '../../../models/user';
import { Beat } from '../../../models/beat';
import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'reproductor-general-beats',
  templateUrl: './reproductor-general-beats.component.html',
  providers: [UserService, BeatService]
})

export class ReproductorGeneralBeatsComponent implements OnInit {
  // Decorador Output
  @Output() PasameElBeat = new EventEmitter();


  public identity;
  public token;
  public url;
  public status;
  public beats: Beat[];
  public total;
  public beatAleatorio;
  public beat;

  public beatEnBucle: boolean = false;

  public sonando;
  public totalBeats;

  public primerBeat;
  public beatSeleccionado;
  public idBeat1;

  public filtroBeat = "";
  constructor(
    private _userService: UserService,
    private _beatService: BeatService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.beat = new Beat("", "Live Jazz", "jazzy", "", "RB7xKfVhJF-dUYMLRH4VSbei.mp3", "", "", "","", true, true, true, "", "", "", "","","","","");
  }
  ngOnInit() {
    console.log('Reproductor cargado');
    this.getBeatsPorEstilo("todos", true);
    var that = this;
    setTimeout( function(){
      that.reproductorBeat();
      that.cambiarBeatAlFinalizar();
    }, 1000 );
  }

  

  public reproductorMovilAbierto:boolean = false;
  abrirCerrarReproductorMovil(accion){
    if(accion == 'abrir') {
      this.reproductorMovilAbierto = true;
      $(".reproductor-general").addClass("abierto-movil");
    } else if(accion == 'cerrar') {
      this.reproductorMovilAbierto = false;
      $(".reproductor-general").removeClass("abierto-movil");
    }
  }

  cambiarEstiloBeats(estilo) {
    alert(estilo);
    this.getBeatsPorEstilo(estilo, true);
  }

  getBeatsPorEstilo(estilo, iniciarReproductor = false) {
    var estilo = estilo;
    var idUsuario;

    if (this.identity) {
      idUsuario = this.identity._id;
    } else {
      idUsuario = "noId";
    }

    this._beatService.getBeatsEstilo(estilo, idUsuario).subscribe(
      response => {
        if (!response.beats) {
          this.status = 'error';
        } else {
          this.beats = response.beats;
          this.totalBeats = response.total;

          this.primerBeat = this.beats['0'];
          this.beatSeleccionado = this.primerBeat;
          this.idBeat1 = this.primerBeat._id;

          if (iniciarReproductor == true) {
            this.getBeat(this.idBeat1, true);
          } else {
            this.getBeat(this.idBeat1);
          }

          console.log(this.beats);
          console.log("Total: " + this.totalBeats);
          console.log(this.idBeat1);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }

    );
  }

  getBeat(id, iniciarReproductor = false) {
    this._beatService.getBeat(id).subscribe(
      response => {
        if (!response.beat) {
          alert("No existe el beat");

        } else {
          this.beat = response.beat;
          console.log(this.beat);
          this.selecionarBeat(this.beat);

          while(this.beat.duration.charAt(0) === '0'){
            this.beat.duration = this.beat.duration.substr(1);
          }

          var that = this;
          setTimeout(function () {
            let file_path = that.url + 'get-audio-beat/' + that.beat.file;
            document.getElementById("audio-reproductor-general").setAttribute("src", file_path);

            if (iniciarReproductor == true) {
              (document.getElementById("audio-reproductor-general") as any).load();
              (document.getElementById("audio-reproductor-general") as any).play();
              that.reproductorBeat();
            }
          }, 300);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  reproductorBeat() {
    var audio = (<any>document.getElementById("audio-reproductor-general"));
    var that = this;

    audio.ontimeupdate = function () {
      var percentage = (audio.currentTime / audio.duration) * 100;
      $("#player-rep-general-barra span").css("width", percentage + "%");

      that.formatearTiempo(audio.currentTime);
      
    };

    audio.onplaying = function () {
      that.sonando = true;
    }

    audio.onpause = function () {
      that.sonando = false;
    }

    $("#player-rep-general-barra").on("click", function (e) {
      var offset = $(this).offset();
      var left = (e.pageX - offset.left);
      var totalWidth = $("#player-rep-general-barra").width();
      var percentage = (left / totalWidth);
      var audioTime = audio.duration * percentage;
      audio.currentTime = audioTime;
    });//click()
  }

  formatearTiempo(seconds) {
    var minutes = (<any> Math.floor(seconds / 60));
    minutes = (minutes >= 10) ? minutes : minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0"+ seconds;

    $("#tiempo-actual-beat-rep-general").html(minutes + ":" + seconds);
  }

  iniciarReproductor(beat) {
    let beat_player = JSON.stringify(beat);
    let file_path = this.url + 'get-audio-beat/' + beat.file;

    this.beat = beat;

    document.getElementById("audio-reproductor-general").setAttribute("src", file_path);
    (document.getElementById("audio-reproductor-general") as any).load();
    (document.getElementById("audio-reproductor-general") as any).play();
    this.sonando = true;
  }

  playReproductor() {
    (document.getElementById("audio-reproductor-general") as any).play();
    this.sonando = true;
  }

  pauseReproductor() {
    (document.getElementById("audio-reproductor-general") as any).pause();
    this.sonando = false;
  }

  selecionarBeat(beat){
    this.beat = beat;
    this.idBeat1 = this.beat._id;

     // Usamos el método emit
     this.PasameElBeat.emit({beat: this.beat});

    
    var beat_selecionado = JSON.stringify(beat);
    localStorage.setItem('beat_seleccionado', beat_selecionado);
  }

  cambiarBeatAlFinalizar(){
    var audio = (<any>document.getElementById("audio-reproductor-general"));
    var that = this;

    audio.onended = function(){
      var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");

      var numBeatSiguiente = idNumBeat*1+1;
      
      if(numBeatSiguiente > that.totalBeats){
        numBeatSiguiente = 1;
      }

      var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
      var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

      var idBeatSiguiente = partesClaseBeatSiguiente[2];

      if(that.beatEnBucle == false){
        that.getBeat(idBeatSiguiente, true);
      } else {
        that.getBeat(that.beat._id, true);
      }
    };
  }

  activarDesactivarBeatEnBucle(){
    if(this.beatEnBucle == false){
      this.beatEnBucle = true;
      $(".btn-bucle-rep-general").addClass("activo");
    }else if(this.beatEnBucle == true){
      this.beatEnBucle = false;
      $(".btn-bucle-rep-general").removeClass("activo");
    }            
  }

  cambiarBeat(direccion){
    var that = this;
    var idNumBeat = $(".otro-beat-"+that.beat._id).attr("id");
    
    if(direccion == "anterior"){
      var numBeatAnterior = idNumBeat*1-1;
      
      if(numBeatAnterior < 1){
        numBeatAnterior = that.totalBeats;
      }

      var claseBeatAnterior = $("#"+numBeatAnterior).attr("class");
      var partesClaseBeatAnterior = claseBeatAnterior.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

      var idBeatAnterior = partesClaseBeatAnterior[2];
      that.getBeat(idBeatAnterior, true);


    } else if(direccion == "siguiente"){
      var numBeatSiguiente = idNumBeat*1+1;

      if(numBeatSiguiente > that.totalBeats){
        numBeatSiguiente = 1;
      }

      var claseBeatSiguiente = $("#"+numBeatSiguiente).attr("class");
      var partesClaseBeatSiguiente = claseBeatSiguiente.split("-"); // otro(0)-beat(1)-57asjd9283jkkldz8(2)

      var idBeatSiguiente = partesClaseBeatSiguiente[2];

      that.getBeat(idBeatSiguiente, true);
    }

  }
}