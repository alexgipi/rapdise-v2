import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { BeatsComponent } from './components/beats/beats.component';
import { ListasBeatsComponent } from './components/listas-beats/listas-beats.component';
import { ListasBeatsUsuarioComponent } from './components/listas-beats-usuario/listas-beats-usuario.component';
import { BeatAddComponent } from './components/beat-add/beat-add.component';
import { BeatEditComponent } from './components/beat-edit/beat-edit.component';
import { BeatsEstiloComponent } from './components/beats-estilo/beats-estilo.component';
import { BeatsFavoritosComponent } from './components/beats-favoritos/beats-favoritos.component';
import { BeatsUsuarioComponent } from './components/beats-usuario/beats-usuario.component';
import { BeatsProductoresComponent } from './components/beats-productores/beats-productores.component';


const beatsRoutes: Routes = [
	{
		path: '', 
		component: MainComponent,
		children: [
			{path: 'editar-beat/:idBeat', component: BeatEditComponent},
			
			{path: 'bases-de-rap', component: BeatsComponent},
			{path: 'bases-de-rap/:estilo', component: BeatsEstiloComponent},
			{path: 'mis-beats-favoritos', component: BeatsFavoritosComponent},
			{path: ':nick/bases', component: BeatsUsuarioComponent},
			
			{path: 'productores-de-rap', component:BeatsProductoresComponent},
			{path: 'bases/listas-de-reproduccion', component:ListasBeatsComponent},
			{path: 'subir-bases', component: BeatAddComponent}

		]
	}
    
    
];

@NgModule({
	imports: [
		RouterModule.forChild(beatsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class BeatsRoutingModule{}