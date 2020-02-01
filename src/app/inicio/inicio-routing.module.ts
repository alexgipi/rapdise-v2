import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes

import { InicioNoLoginComponent } from './components/inicio-no-login/inicio-no-login.component';
import { InicioLogueadoComponent } from './components/inicio-logueado/inicio-logueado.component';

const inicioRoutes: Routes = [
	{path: '', component: InicioLogueadoComponent},
	{path: 'sobre-rapdise', component: InicioNoLoginComponent}
];

@NgModule({
	imports: [
		RouterModule.forChild(inicioRoutes)
	],
	exports: [
		RouterModule
	]
})

export class InicioRoutingModule{}