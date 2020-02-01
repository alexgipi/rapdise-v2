export class ComentarioPub {
	constructor(
		public _id: string,        
        public publicacion: string,
        public user: string,
        public texto: string,
        public likes: string,
        public creado_el: string
	){}
}