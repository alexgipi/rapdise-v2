import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import {TimelineComponent } from './components/timeline/timeline.component';

const muroRoutes: Routes = [
	{
		path: 'muro', 
		component: MainComponent,
		children: [
			// { path: '', redirectTo: 'muro', pathMatch: 'full' },
			{ path: '', component:TimelineComponent }
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(muroRoutes)
	],
	exports: [
		RouterModule
	]
})

export class MuroRoutingModule{}