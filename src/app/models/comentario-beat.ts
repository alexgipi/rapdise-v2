export class ComentarioBeat {
	constructor(
		public _id: string,        
        public beat: string,
        public user: string,
        public texto: string,
        public likes: string,
        public creado_el: string
	){}
}