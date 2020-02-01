import { Component, OnInit, Input,} from '@angular/core';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'caratula-biblioteca',
  templateUrl: './caratula-biblioteca.component.html'
})
export class CaratulaBibliotecaComponent implements OnInit {
  public titulo:string;
  public url: string;
  
  
  @Input() ajustesCaratula;
  @Input() imagenBeat;
  

  constructor(

  ){
  	this.titulo = 'Caratula biblioteca';
    this.url = GLOBAL.url;
  }

  

  ngOnInit(){
    console.log('caratula-biblioteca.component cargado');
    console.log(this.ajustesCaratula);
    console.log(this.imagenBeat)
  }

  

}