import { Component, OnInit, Input,  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { Destacado } from '../../../models/destacado';

import { UserService } from '../../../services/user.service';
import { DestacadoService } from '../../../services/destacado.service';

import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'boton-destacar-usuario',
  templateUrl: './boton-destacar-usuario.component.html',
  styleUrls: ['./boton-destacar-usuario.component.scss'],
  providers: [UserService, DestacadoService]
})
export class BotonDestacarUsuarioComponent implements OnChanges,OnInit {
  public url: string;
	public status: string;
	public identity;
  public token;
  
  public nuevoDestacado: Destacado;
  public destacado: Destacado;
  public esDestacado;

  @Input() usuarioDestacadoEn;
  @Input() usuario;
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
    const usuario: SimpleChange = changes.usuario;
    console.log('valor previo: ', usuario.previousValue);
    console.log('valor actual: ', usuario.currentValue);
    this.usuario = usuario.currentValue;
    this.comprobarSiEsDestacado('usuario', this.usuario._id, this.usuarioDestacadoEn);
  }

  ngOnInit() {
    this.comprobarSiEsDestacado('usuario', this.usuario._id, this.usuarioDestacadoEn);
  }

  comprobarSiEsDestacado(tipo,idContenidoDestacado,usuarioDestacadoEn){
    this._destacadoService.comprobarSiEsDestacado(tipo,idContenidoDestacado,usuarioDestacadoEn).subscribe(
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

  destacarUsuario(){
    this.nuevoDestacado.tipo = 'usuario';
    this.nuevoDestacado.usuarioDestacado = this.usuario._id;
    this.nuevoDestacado.usuarioDestacadoEn = this.usuarioDestacadoEn;

    console.log(this.nuevoDestacado);
    this._destacadoService.guardarDestacado(this.token, this.nuevoDestacado).subscribe(
      response => {
        if(response.destacado){
          this.destacado = response.destacado;
          console.log("Usuario destacado correctamente");
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

  borrarUsuarioDestacado(){
    alert("Borrar "+this.usuario.nick+" de "+this.usuarioDestacadoEn);
    this._destacadoService.eliminarDestacado(this.token, 'usuario', this.usuario._id, this.usuarioDestacadoEn).subscribe(
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
