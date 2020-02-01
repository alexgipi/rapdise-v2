import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBatallasBusqueda'
})
export class FiltroBatallasBusquedaPipe implements PipeTransform {

  transform(batallas: any, arg: any): any {
    if(arg === '' || arg.length < 3) return batallas;
    const resultadoBatallas = [];

    for(const batalla of batallas){
      if(batalla.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        console.log("SI");
        resultadoBatallas.push(batalla);
      }
    }

    return resultadoBatallas;
  }

}
