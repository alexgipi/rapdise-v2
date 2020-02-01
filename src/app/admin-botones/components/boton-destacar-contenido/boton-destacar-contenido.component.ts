import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { Destacado } from '../../../models/destacado';

import { UserService } from '../../../services/user.service';
import { DestacadoService } from '../../../services/destacado.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'boton-destacar-contenido',
  templateUrl: './boton-destacar-contenido.component.html',
  styleUrls: ['./boton-destacar-contenido.component.scss'],
  providers: [UserService, DestacadoService]
})
export class BotonDestacarContenidoComponent implements OnChanges, OnInit {
  public url: string;
	public status: string;
	public identity;
  public token;
  
  public nuevoDestacado: Destacado;
  public destacado: Destacado;
  public esDestacado = false;

  @Input() usuarioDestacadoEn;
  @Input() tipo;
  @Input() batalla;
  @Input() freestyle;
  @Input() beat;
  constructor(
    private _userService: UserService,
    private _destacadoService: DestacadoService
  ){
    this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if(this.identity){
      this.nuevoDestacado = new Destacado("", "","","","", "", "", "", this.identity._id, "");
    }else {
      this.nuevoDestacado = new Destacado("", "","","","", "", "", "", "", "");
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    

    if(this.tipo == 'batalla'){
      const batalla: SimpleChange = changes.batalla;
      console.log('prev value: ', batalla.previousValue);
      console.log('got name: ', batalla.currentValue);
      this.batalla = batalla.currentValue;
      this.comprobarSiEsDestacado(this.tipo, this.batalla._id);
    } else if(this.tipo == 'freestyle'){
      const freestyle: SimpleChange = changes.freestyle;
      console.log('prev value: ', freestyle.previousValue);
      console.log('got name: ', freestyle.currentValue);
      this.freestyle = freestyle.currentValue;
      this.comprobarSiEsDestacado(this.tipo, this.freestyle._id);
    } else if(this.tipo == 'beat') {
      const beat: SimpleChange = changes.beat;
      console.log('prev value: ', beat.previousValue);
      console.log('got name: ', beat.currentValue);
      this.beat = beat.currentValue;
      this.comprobarSiEsDestacado(this.tipo, this.beat._id);
    }
  }

  ngOnInit() {
    
    if(this.tipo == 'batalla'){
      this.comprobarSiEsDestacado(this.tipo, this.batalla._id);
    } else if(this.tipo == 'freestyle'){
      this.comprobarSiEsDestacado(this.tipo, this.freestyle._id);
    } else if(this.tipo == 'beat') {
      this.comprobarSiEsDestacado(this.tipo, this.beat._id);
    }
  }

  comprobarSiEsDestacado(tipo,idContenidoDestacado){
    this._destacadoService.comprobarSiEsDestacado(tipo,idContenidoDestacado).subscribe(
      response => {
        if(response){
          console.log(response);
          this.esDestacado = response.esDestacado;
          if(response.destacado){
            this.destacado = response.destacado[0];
          }
        }
      },
      error => {

      }
    )
  }

  guardarDestacado(){
    this.nuevoDestacado.tipo = this.tipo;

    if(this.tipo == 'batalla'){
      this.nuevoDestacado.batallaDestacada = this.batalla._id;
    } else if(this.tipo == 'freestyle'){
      this.nuevoDestacado.freestyleDestacado = this.freestyle._id;
    } else if(this.tipo == 'beat') {
      this.nuevoDestacado.beatDestacado = this.beat._id;
    }

    console.log(this.nuevoDestacado);
    this._destacadoService.guardarDestacado(this.token, this.nuevoDestacado).subscribe(
      response => {
        console.log(response)
        if(response.destacado){
          console.log(response)
          this.destacado = response.destacado;
          console.log(this.tipo + " destacado/a correctamente");
          this.esDestacado = true;
        } else{
          this.status = 'error';
        }
      },
      error => {
        var mensajeError = <any>error;
        console.log(mensajeError);

        if(mensajeError != null){
          this.status = 'error';
        }
      }
    )
  }

  eliminarDestacado(){
    var idContenidoDestacado;

    if(this.tipo == 'batalla'){
      idContenidoDestacado = this.batalla._id;
    } else if(this.tipo == 'freestyle'){
      idContenidoDestacado = this.freestyle._id;
    } else if(this.tipo == 'beat') {
      idContenidoDestacado = this.beat._id;
    }
    alert("borrar");
    this._destacadoService.eliminarDestacado(this.token, this.tipo, idContenidoDestacado).subscribe(
      response => {
        if(response){
          this.esDestacado = false;
        } else{
          this.status = 'error';
        }
      },
      error => {
        var mensajeError = <any>error;
        console.log(mensajeError);

        if(mensajeError != null){
          this.status = 'error';
        }
      }
    )
  }

}
