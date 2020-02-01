import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { ListadoBatallasComponent } from './components/listado-batallas/listado-batallas.component';
import { MisBatallasComponent } from './components/mis-batallas/mis-batallas.component';
import { NuevaBatallaComponent } from './components/nueva-batalla/nueva-batalla.component';
import { ResponderBatallaComponent } from './components/responder-batalla/responder-batalla.component';

import { NuevaBatallaDesafiarComponent } from './components/nueva-batalla-desafiar/nueva-batalla-desafiar.component';
import { BatallaVSComponent } from './components/batalla-vs/batalla-vs.component';

import { ListadoBatallasDirectoComponent } from './components/listado-batallas-directo/listado-batallas-directo.component';
import { BatallaEnDirectoComponent } from './components/batalla-en-directo/batalla-en-directo.component';

import { BuscarRivalComponent } from './components/buscar-rival/buscar-rival.component';

const batallasRoutes: Routes = [


	

			{ path: 'batallas-de-rap', component:ListadoBatallasComponent },
			{ path: 'batallas-de-rap/crear-batalla', component:NuevaBatallaComponent},
			{ path: 'batallas-de-rap/buscar-rival', component:BuscarRivalComponent},
			{ path: 'batallas-de-rap/crear-batalla/desafiar', component:NuevaBatallaDesafiarComponent},
			{ path: 'batallas-de-rap/crear-batalla/desafiar/:nick', component:BatallaVSComponent},
			{path: 'batallas-de-rap/responder/:idBatalla', component:ResponderBatallaComponent},
			{path: 'batallas-de-rap/en-directo', component:ListadoBatallasDirectoComponent},
			{path: 'batallas-de-rap/directo/:nick', component:BatallaEnDirectoComponent},
			{path: 'batallas-de-rap/mis-batallas', component:MisBatallasComponent}
		

	
];

@NgModule({
	imports: [
		RouterModule.forChild(batallasRoutes)
	],
	exports: [
		RouterModule
	]
})

export class BatallasRoutingModule{}