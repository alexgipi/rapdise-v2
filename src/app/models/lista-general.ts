export class ListaGeneral {
	constructor(
		public _id: string,
        public nombre: string,
        public tipo: string,
        public descripcion: string,
        public estado: string,
        public visiblidad:string,
        public imagen: string,
        public contenidoLista: any,
        public user: string,
        public reputacion: string,
        public reproducciones: string,  
		public denuncias: string,
		public creado_el: string		
	){}
}