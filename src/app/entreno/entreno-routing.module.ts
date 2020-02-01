import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { PorPalabrasComponent } from './components/por-palabras/por-palabras.component';
import { PorImagenComponent } from './components/por-imagen/por-imagen.component';

import { PorProfesionesComponent } from './components/por-profesiones/por-profesiones.component';

const entrenoRoutes: Routes = [
	{
		path: 'entrenar-freestyle', 
		component: MainComponent,
		children: [
			{ path: '', redirectTo: 'palabras', pathMatch: 'full' },
			{ path: 'palabras', component:PorPalabrasComponent},
			{ path: 'imagenes', component:PorImagenComponent},

			{ path: 'profesiones', component:PorProfesionesComponent},
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(entrenoRoutes)
	],
	exports: [
		RouterModule
	]
})

export class EntrenoRoutingModule{}