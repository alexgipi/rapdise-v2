import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { InformacionPersonalComponent } from './components/informacion-personal/informacion-personal.component';

const ajustesRoutes: Routes = [
	{
		path: 'ajustes', 
		component: MainComponent,
		children: [
			// { path: '', redirectTo: 'muro', pathMatch: 'full' },
			{ path: 'editar-perfil', component:InformacionPersonalComponent }
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(ajustesRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AjustesRoutingModule{}