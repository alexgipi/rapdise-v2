import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { ImagenesComponent } from './components/imagenes/imagenes.component';
import { PalabrasComponent } from './components/palabras/palabras.component';

const adminRoutes: Routes = [
	{
		path: 'admin', 
		component: MainComponent,
		children: [
			// { path: '', redirectTo: 'muro', pathMatch: 'full' },
			{ path: 'imagenes', component:ImagenesComponent },
			{ path: 'palabras', component:PalabrasComponent },
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(adminRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AdminRoutingModule{}