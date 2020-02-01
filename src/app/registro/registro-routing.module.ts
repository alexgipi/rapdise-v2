import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroAjustarPerfilComponent } from './components/registro-ajustar-perfil/registro-ajustar-perfil.component';
import { RegistroFinalizadoComponent } from './components/registro-finalizado/registro-finalizado.component';
import { LoginComponent } from './components/login/login.component';

const registroRoutes: Routes = [
	{ path: 'registro', component:RegistroComponent },
	{ path: 'registro/ajustar-perfil', component:RegistroAjustarPerfilComponent },
	{ path: 'registro-finalizado', component:RegistroFinalizadoComponent },
	{path: 'iniciar-sesion', component:LoginComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(registroRoutes)
	],
	exports: [
		RouterModule
	]
})

export class RegistroRoutingModule{}