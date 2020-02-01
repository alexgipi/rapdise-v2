import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss']
})
export class ImagenesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.masonry(4);
  }

  masonry(columnas){
    const listadoMasonry = (contenedor, items, columnas) => {
        contenedor.addClass('listado-masonry');
        contenedor.addClass(`columnas-${columnas}`);

        
        let columnasElements = [];
    
        for(let i = 1; i <= columnas; i++){
            var columna = document.createElement('div');

            columna.classList.add('columna-masonry', `columna-${i}`);
            contenedor.append(columna);
            columnasElements.push(columna);
        }
    
        for( let m = 0; m < Math.ceil(items.length / columnas); m++){
            for(let n = 0; n < columnas; n++){
                let item = items[m * columnas + n];
                
                console.log(item);
                if(item != undefined){
                    columnasElements[n].append(item);
                }
            }
        }
    }

    listadoMasonry($("#galeria-masonry"), $(".item-masonry"), columnas);
  }

}
