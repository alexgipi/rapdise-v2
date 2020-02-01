import { Component, OnInit} from '@angular/core';

import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';

import {saveAs} from 'file-saver';
import {TranslateService} from '@ngx-translate/core';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'barra-reproductor-general',
  templateUrl: './barra-reproductor-general.component.html',
  providers: [UserService, BeatService]
})

export class BarraReproductorGeneralComponent implements OnInit {
    public identity;
    public token;
    public url;
	public status;

    public beatAleatorio: boolean = false;
    public beatEnBucle: boolean = false;
	
	public sonando = false;
	public beatReproductor;
	public tiempoActual = 0;
	public duracion;
	
    
    constructor(
        private _userService: UserService,
        private _beatService: BeatService,
		public translate: TranslateService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
	}
	

    ngOnInit() {
		GLOBAL.DEBUG && console.log('Barra Reproductor cargado');
		
		this.getBeatReproductor();
	}


	getBeatReproductor() {
		this.beatReproductor = new Audio('https://rapdise.com/api/get-audio-beat/qn-J4IUgcPf6bG_ftwsCtvt1.mp3');
		
		this.beatReproductor.addEventListener('timeupdate',this.timeupdate);
		this.beatReproductor.addEventListener('loadedmetadata',this.loadedmetadata);
		this.beatReproductor.addEventListener('ended',this.ended);
	}


	
	playAudio(){
		this.beatReproductor.play()
		this.sonando = true;
	}

	pauseAudio(){
		this.beatReproductor.pause();
		this.sonando = false;
	}

	
	timeupdate = (e) => {  
		this.tiempoActual = this.beatReproductor.currentTime;
	}

	
	loadedmetadata = (e) => {  
		this.duracion = this.beatReproductor.duration;
	}

	ended = (e) => {  
		console.log("Fin"); 
	}

	onInputChange(event: any) {
		this.beatReproductor.currentTime = event.value;
	}
	

    formatearTiempo(segundos, elemento) {
        var minutos = (<any> Math.floor(segundos / 60));
        minutos = (minutos >= 10) ? minutos : minutos;
        segundos = Math.floor(segundos % 60);
        segundos = (segundos >= 10) ? segundos : "0"+ segundos;

        return minutos + ":" + segundos;
    }


    activarDesactivarBeatEnBucle(){
		if(this.beatEnBucle == false){
			this.beatEnBucle = true;
		} else {
			this.beatEnBucle = false;
		}
    }

    
    activarDesactivarBeatAleatorio(){
		if(this.beatAleatorio == false){
			this.beatAleatorio = true;
		} else {
			this.beatAleatorio = false;
		}
    }

    cambiarBeat(direccion){
        if(direccion == 'anterior'){
			alert("anterior");
		} else if ( direccion == 'siguiente') {
			alert("siguiente");
		}
    }
    

    descargar(nombreArchivo){

        this._beatService.descargarBeat(nombreArchivo).subscribe(
            response => saveAs(response, nombreArchivo),
            error => console.error(error)
        );

    }
   

}