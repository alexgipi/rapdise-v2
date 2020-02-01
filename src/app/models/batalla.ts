export class Batalla {
	constructor(
		public _id: string,
		public nombre: string,
		public visibilidad: string,
		public rondas: number,

		public modoRonda1: string,
		public modoRonda2: string,
		public modoRonda3: string,

		public tiempoTurnoRonda1: number,
		public tiempoTurnoRonda2: number,
		public tiempoTurnoRonda3: number,

		public sangreRonda1: string,
		public sangreRonda2: string,
		public sangreRonda3: string,

		public acapellaRonda1: string,
		public acapellaRonda2: string,
		public acapellaRonda3: string,

		public palabrasImpro1: string,
		public palabrasImpro2: string,
		public palabrasImpro3: string,
		public palabrasImpro4: string,
		public palabrasImpro5: string,
		public palabrasImpro6: string,

		public base1: any,
		public base2: any,
		public base3: any,
		public base4: any,

		public impro1: string,
		public impro2: string,
		public impro3: string,
		public impro4: string,
		public impro5: string,
		public impro6: string,

		public usuario1: any,
		public usuario2: any,

		public estado: string,

		public puntos1: any,
		public puntos2: any,
		public puntosReplica: any,
		public ganador: string,

		public visualizaciones: any,
		public likes: any,
		
		public creado_el: string,
		public modificado_el: string,
		public tiempoMaxRespuesta: number,
		public finalizado_el: string
	){}
}