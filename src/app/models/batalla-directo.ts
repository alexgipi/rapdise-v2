export class BatallaDirecto {
	constructor(
        public _id: string,
        public nick: string,
        public modo: string,
        public rondas: string,
        public tiempoRonda: string,
        public tiempoPalabra: string,
        public usuario1: string,
        public usuario2: string,
        public estado: string,
        public espectadores: any,
        public aplausos: any,
        public creado_el: string
        
	){}
}