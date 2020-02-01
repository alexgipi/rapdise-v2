import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { InicioComponent } from './components/inicio/inicio.component';

const chatGeneralRoutes: Routes = [

	{ path: 'chat-publico', component:InicioComponent},
	
];

@NgModule({
	imports: [
		RouterModule.forChild(chatGeneralRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ChatGeneralRoutingModule{}