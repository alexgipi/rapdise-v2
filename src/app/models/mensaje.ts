export class Mensaje {
	constructor(
		public _id: string,
		public tipo: string,
		public texto: string,
		public emisor: string,
		public receptor: string,
		public archivo: string,
		public imagen: string,
		public audio: string,
		public audioEscuchado: string,
		public visto: string,
		public creado_el: string,
	){}
}