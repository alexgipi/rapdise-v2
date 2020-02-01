import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FreestylesComponent } from './components/freestyles/freestyles.component';
import { MisFreestylesComponent } from './components/mis-freestyles/mis-freestyles.component';


const improsRoutes: Routes = [
	{
		path: 'freestyle', 
		component: MainComponent,
		children: [
			{ path: '', component:FreestylesComponent },
			{ path: 'mis-freestyles', component:MisFreestylesComponent  }
		]
	},
	{ path: 'freestyle/grabadora', component:InicioComponent  }

];

@NgModule({
	imports: [
		RouterModule.forChild(improsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ImprosRoutingModule{}