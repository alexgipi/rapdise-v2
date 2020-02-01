import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBeats'
})
export class FiltroBeatsPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg === '' || arg.length < 3) return value;
    const resultadoBeats = [];
    for(const beat of value){
      if(beat.name.toLowerCase().indexOf(arg.toLowerCase()) > -1 || beat.user.nick.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        console.log("SI");
        resultadoBeats.push(beat);
      }
    }
    return resultadoBeats;
  }

}
