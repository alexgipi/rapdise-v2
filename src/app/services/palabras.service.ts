import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class PalabrasService {
	public url:string;
	public palabras;

	constructor(public _http: HttpClient){
		this.url = 'https://picsum.photos/0200/';
		
		this.palabras = [
			'aguja','alambre','aluminio','arandela','arroz','ábaco',
			'abrelatas','abrigo','aceite','agua','álbum','alfombra',
			'almohada','ancla','antena','antifaz','arcilla','arco',
			'arena','arete','aspiradora','balón','banana','bandera',
			'batería','bellota','bloque','boa','bolsillo','bombilla',
			'boquilla','botella','broche','budín','bufanda','buzón',
			'cabello','cacahuate','caballete','cartón','caucho','cerilla',
			'cinta','círculo','clavo','concha','copia','corazón','cuadrado',
			'cuchara','cucharón','cuerda','cuero','calabacita',
			'calabaza','calcetín','cámara','camisa','campana','canasta',
			'canica','caña','caramelo','carpeta','carta','cartera','cascanueces',
			'casco','cebolla','cepillo','cera','cerradura','cinturón','cobija',
			'colador','comba','cometa','corbata','corona','correa','cuchillo',
			'cuerno','chaleco','chaqueta','diamante','dólar','dominó','dado',
			'estrella','etiqueta','enchufe','estera','exprimidor','fideos','filtro',
			'flecha','frijoles','flor','florero','galleta','gancho','gorra','gorro',
			'harina','hilo','hoja','huesos','harmónica','helado','hierro','hueso',
			'huevo','incienso','imán','interruptor','jabón','jarra','jarrón','jeans',
			'ketchup','kiwi','lápiz','lentes','libro','listón','ladrillo','lámpara',
			'lápiz','lata','leche','lima','limón','linterna','losa','llave','macarrón',
			'malvavisco','moneda','mitón','madera','malla','manguera','manilla',
			'manopla','manzana','marco','marioneta','martillo','mecate','medias',
			'micrófono','mitón','manopla','mostaza','muñeca','naranja','nuez',
			'orificio','óvalo','olla','orejeras','paleta','pañuelo','papel','pasador',
			'peineta','penique','pin','pluma','pulgada','palo','pantalón','pañal',
			'paraguas','patata','pedal','película','percha','periódico','piedra',
			'piel','pijama','pimienta','pinzas','pipa','pizarra','platillo','plato',
			'pomelo','púa','rayo','regla','ropa','radio','regalo','reloj','despertador',
			'remoto','revista','rompecabezas','rotulador','rueda','sacos','sal','sandia',
			'servilleta','sierra','silbato','sobre','sombrero','sonaja','spaghetti',
			'suéter','sujetador','sujetapapeles','telaraña','terciopelo','triángulo',
			'taladro','talco','tambor','tapa','tarro','taza','tazón','teclado','teléfono',
			'temporizador','tenedor','termómetro','tetera','tijeras','toalla','tostadora',
			'trompeta','velero','ventilador','vainilla','vela','velo','vestido','vida',
			'vinagre','violín','visera','xilófono','yogurt','zigzag'
		];

		//ultimo id 94
	}

	getPalabras():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')

		return this.palabras;
	}
	
}