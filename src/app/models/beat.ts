export class Beat {
	constructor(
		public _id: string,
		public name: string,
		public style: any,
		public uso: string,
		public file: string,
		public duration: string,
		public image: string,
		public descripcion: string,
		public enlace: string,
		public permitirBatalla: boolean,
		public permitirGrabacion: boolean,
		public permitirEntreno:  boolean,
		public created_at: string,
		public likes: any,
		public reproducciones: any,
		public autor: string,
		public bpm: string,
		public etiquetas: any,
		public ajustesCaratula: any,
		public user: string
	){}
}
