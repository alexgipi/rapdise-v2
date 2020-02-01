export class Grabacion {
	constructor(
		public _id: string,
		public tipo: string,
		public modo: string,
		public tiempoCambio: any,
		public nombre: string,
		public descripcion: string,
		public imagen: string,
		public estado: string,
		public reproducciones: number,
		public reputacion: string,
		public palabras: string,
		public denuncias: string,
		public creado_el: string,
		public audio: string,
		public tiempoGrabacion:any,
		public beat: string,
		public user: any,
		public volumenBeat: any,
		public volumenVoz: any
	){}
}