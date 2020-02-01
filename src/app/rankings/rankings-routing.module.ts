import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';

const rankingsRoutes: Routes = [
	{
		path: 'rankings', 
		component: MainComponent,
		children: [
			// { path: '', redirectTo: 'muro', pathMatch: 'full' },
			// { path: '', component:InformacionPersonalComponent }
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(rankingsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class RankingsRoutingModule{}