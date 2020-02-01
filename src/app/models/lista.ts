export class Lista {
	constructor(
		public _id: string,
        public nombre: string,
        public tipo: string,
        public descripcion: string,
        public estado: string,
        public enBiblioteca:string,
        public reputacion: string,
		public imagen: string,
        public user: string,
        public beats: any,
		public denuncias: string,
		public creado_el: string		
	){}
}