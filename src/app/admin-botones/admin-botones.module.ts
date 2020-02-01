import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { BotonDestacarContenidoComponent } from './components/boton-destacar-contenido/boton-destacar-contenido.component';
import { BotonDestacarUsuarioComponent } from './components/boton-destacar-usuario/boton-destacar-usuario.component';



@NgModule({
  declarations: [BotonDestacarContenidoComponent, BotonDestacarUsuarioComponent],
  imports: [
    CommonModule,
    MomentModule
  ],
  exports: [
    BotonDestacarContenidoComponent,
    BotonDestacarUsuarioComponent
  ],
})
export class AdminBotonesModule { }
