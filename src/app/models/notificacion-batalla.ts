export class NotificacionBatalla {
	constructor(
        public _id: string,
        public batalla: string,
        public usuario: string,
        public textoNotificacion: string,
        public visto: string,
        public creado_el: string
	){}
}