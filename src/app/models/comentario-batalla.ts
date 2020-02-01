export class ComentarioBatalla {
	constructor(
		public _id: string,        
        public batalla: string,
        public user: string,
        public texto: string,
        public likes: string,
        public creado_el: string
	){}
}