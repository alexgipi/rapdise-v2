export class Voto {
	constructor(
        public _id: string,
        public jurado: string,
        public batalla: string,
        public ganador: string,
        public creado_el: string
	){}
}