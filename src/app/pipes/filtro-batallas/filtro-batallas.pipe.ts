import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBatallas'
})
export class FiltroBatallasPipe implements PipeTransform {

  transform(batallas: any, rondas: any, tiempoRondas?: any, modoRondas?: any, sangreRondas?: any, acapellaRondas?: any): any {

    console.log('Batallas', batallas);
    console.log('Rondas',rondas);
    console.log('tiempoRondas',tiempoRondas);
    console.log('modoRondas',modoRondas);
    console.log('sangreRondas',sangreRondas);
    console.log('acapellaRondas',acapellaRondas);


    const resultadoBatallas = [];

    if(batallas){   
      for(const batalla of batallas){

        if(rondas.length > 0){
          console.log("hay rondas")
        }else {
          console.log("no hay rondas");
        }
        

        if(rondas.length > 0 && rondas.indexOf(batalla.rondas) > -1
          && tiempoRondas.length > 0 && tiempoRondas.indexOf(batalla.tiempoTurnoRonda1) > -1
          && modoRondas.length > 0 && modoRondas.indexOf(batalla.modoRonda1) > -1
          && sangreRondas.length > 0 && sangreRondas.indexOf(batalla.sangreRonda1) > -1
          && acapellaRondas.length > 0 && acapellaRondas.indexOf(batalla.acapellaRonda1) > -1
        ){
          console.log("SI");
          resultadoBatallas.push(batalla);
        }
        console.log("filtroBatallas presente");
      }
    }

    return resultadoBatallas;
  }

}
