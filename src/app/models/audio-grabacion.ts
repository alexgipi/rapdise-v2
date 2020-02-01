export class AudioGrabacion{
	constructor(
		public _id: string,
        public usuario: string,
        public grabacionBase64: string,
        public nombreArchivo:string,
        public creado_el:string
	){}
}