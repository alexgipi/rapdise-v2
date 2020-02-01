import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes

// import { LogrosComponent } from './components/logros/logros.component';

// // import { PerfilComponent } from './components/perfil/perfil.component';
// // import { PerfilGrabacionesComponent } from './components/perfil-grabaciones/perfil-grabaciones.component';
// // import { PerfilBatallasComponent } from './components/perfil-batallas/perfil-batallas.component';
// // import { PerfilSiguiendoComponent } from './components/perfil-siguiendo/perfil-siguiendo.component';
// // import { PerfilSeguidoresComponent } from './components/perfil-seguidores/perfil-seguidores.component';

// import { ListadoBatallasComponent } from './batallas/components/listado-batallas/listado-batallas.component';

// //BUSQUEDA
// import { PaginaBusquedaComponent } from './components/pagina-busqueda/pagina-busqueda.component';


import {UserGuard} from './services/user.guard';


const appRoutes: Routes = [
	// {path: 'login', component: LoginComponent},
	
	// {path: ':nick', component: PerfilComponent},

	// {path: 'grabaciones/:nick', component: PerfilGrabacionesComponent},
	// {path: 'batallas/:nick', component: PerfilBatallasComponent},
	// {path: 'siguiendo/:nick', component: PerfilSiguiendoComponent},
	// {path: 'seguidores/:nick', component: PerfilSeguidoresComponent},

	// {path: 'logros', component: LogrosComponent, canActivate:[UserGuard]},
	// {path: 'buscar/:textoBusqueda', component: PaginaBusquedaComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);