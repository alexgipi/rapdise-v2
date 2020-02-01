import { Component, OnInit, Input, Output, EventEmitter, OnChanges , SimpleChanges , SimpleChange} from '@angular/core';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'crear-caratula-biblioteca',
  templateUrl: './crear-caratula-biblioteca.component.html'
})
export class CrearCaratulaBibliotecaComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;
  @Input() imagenRecortada;
  
  @Output() PasarAjustesCaratula = new EventEmitter();
  
  @Input() tipoCaratula;

  @Output() PasarTipoCaratula = new EventEmitter();
  


  public colorFondo = "gris-oscuro";
  public colorBarras = "blanco";
  public opacidadBarras = 1;
  public ajustesCaratula = {
    "tipoCaratula": "",
    "colorFondo": this.colorFondo,
    "colorBarras": this.colorBarras,
    "opacidadBarras": this.opacidadBarras,
    "ondas1": true,
    "ondas2": false,
    "mostrarLogo": true,
  }

  public ajustesAbierto = false;

  public checked = true;

  constructor(

  ){
  	this.title = 'Caratula biblioteca';
    this.url = GLOBAL.url;
  }

  

  ngOnInit(){
    console.log('crear-caratula-biblioteca.component cargado');
    this.ajustesCaratula.tipoCaratula = this.tipoCaratula;
    this.lanzar()
  }

  ngOnChanges(changes: SimpleChanges) {
    // const currentItem: SimpleChange = changes.tipoCaratula;

    // if(currentItem.currentValue == 'imagen'){
    //   console.log('got item: ', currentItem.currentValue);
    // }

    if (this.tipoCaratula && changes.tipoCaratula) {
      if (changes.tipoCaratula.currentValue != changes.tipoCaratula.previousValue ){
        console.log('value changed to ' + this.tipoCaratula)
        this.tipoCaratula = this.tipoCaratula;
        this.ajustesCaratula.tipoCaratula = this.tipoCaratula;
        this.lanzar();
      }
    }
  }

  setTipoCaratula(tipo){
    this.tipoCaratula = tipo;
    this.ajustesCaratula.tipoCaratula = this.tipoCaratula;

    this.PasarTipoCaratula.emit({tipoCaratula: this.tipoCaratula});

    if(tipo == 'rapdise'){
      $(".modal-rapdise").removeClass("abierto");
    } else if(tipo == 'imagen') {
      this.ajustesCaratula.mostrarLogo = false;
      this.lanzar();
    }
  }

  abrirCerrarAjustes(){
    if(this.ajustesAbierto == false){
      this.ajustesAbierto = true;
    } else {
      this.ajustesAbierto = false;
    }
  }

  setColorFondo(color){
    this.colorFondo = color;
    this.ajustesCaratula.colorFondo = this.colorFondo;
    this.lanzar();
  }

  setColorBarras(color){
    this.colorBarras = color;
    this.ajustesCaratula.colorBarras = this.colorBarras;
    this.lanzar();
  }

  // Cuando se lance el evento click en la plantilla llamaremos a este método
  lanzar(){
    // Usamos el método emit
    this.PasarAjustesCaratula.emit({ajustesCaratula: this.ajustesCaratula});
  }

  setOndas1(event){
    this.ajustesCaratula.ondas1 = event.checked;
    this.lanzar();
  }

  setOndas2(event){
    this.ajustesCaratula.ondas2 = event.checked;
    this.lanzar();
  }

  setLogoRapdise(event){
    this.ajustesCaratula.mostrarLogo = event.checked;
    this.lanzar();
  }

  setOpacidadBarras(value) {
    console.log(value);
    this.opacidadBarras = value;
    this.ajustesCaratula.opacidadBarras = this.opacidadBarras;
    this.lanzar();
  }
  

}