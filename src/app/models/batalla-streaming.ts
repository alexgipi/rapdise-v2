export class BatallaStreaming {
	constructor(
        public _id: string,
        public nick: string,
	public estado: string,
	public modo: string,
	public rondas: string,
	public tiempoRonda1: string,
	public tiempoRonda2: string,
	public tiempoCambioRonda1: string,
	public tiempoCambioRonda2: string,
	public beatRonda1: string,
	public beatRonda2: string,
	public voz1:string,
	public voz2:string,
	public voz3:string,
	public voz4:string,
	public usuario1: string,
	public usuario2: string,
	public ganador: string,
	public creado_el: string
        
	){}
}