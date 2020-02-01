import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as io from 'socket.io-client';

import { User } from '../../../models/user';
import { Publication } from '../../../models/publication';
import { LikePublication } from '../../../models/like-publication';
import { ComentarioPub} from '../../../models/comentario-pub';
import { Beat } from '../../../models/beat';
import { Grabacion } from '../../../models/grabacion';


import { UserService } from '../../../services/user.service';
import { BeatService } from '../../../services/beat.service';
import { GrabacionService } from '../../../services/grabacion.service';
import { PublicationService } from '../../../services/publication.service';
import { LikePublicationService } from '../../../services/like-publication.service';
import { ComentarioService } from '../../../services/comentario.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  providers: [UserService, PublicationService,LikePublicationService, ComentarioService, BeatService, GrabacionService]
})

export class TimelineComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public status: string;
	public socket: SocketIOClient.Socket;
	public urlSocket;
	
	public publications: Publication[];
	public publication: Publication;	
	public page;
	public total;
	public pages;
	public itemsPerPage;


	public likePublication: LikePublication;
	public likes = [];
	public totalLikes;

	public comentariosPub: ComentarioPub[];
	public totalComentariosPub;
	
	public beats: Beat[];	
	public grabaciones: Grabacion[];
	public totalGrabaciones;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService,
		private _likePublicationService: LikePublicationService,
		private _comentarioService: ComentarioService,
		private _beatService: BeatService,
		private _grabacionService: GrabacionService

	){
		this.titulo = 'Muro';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.page = 1;
		this.urlSocket = GLOBAL.urlSocket;
		this.socket = io.connect(this.urlSocket);
	}
	ngOnInit(){
		console.log('Componente publications cargado!');
		this.getPublicationsPaginado(this.page);
		this.getBeats();
		this.getGrabaciones();

		$("html, body").animate({ scrollTop: 0 }, 400);

		this.cargarSocket();
		
	}

	getPublicationsPaginado(page, adding = false){
		if(this.identity){
			this._publicationService.getPublicationsPaginado(this.token, page).subscribe(
				response => {
					if(response.publications){
						this.total = response.total_items;
						this.pages = response.pages;
						this.itemsPerPage = response.items_per_page;

						// this.likes = response.publications_me_gustan;
						// console.log(this.likes);
						this.getPubsMeGustan(page);

						var that = this;
						setTimeout(function(){
							response.publications.forEach((pub, index) => {

								if(pub.tipo == 'video'){
									console.log(pub);
									const htmlContent = document.getElementById('video-youtube-'+pub._id);

									htmlContent.innerHTML = that.transformarEnlaceYoutube(htmlContent.innerHTML);
								}
								that.render(pub);	
								
							});
								

						}, 200);

						if(!adding) {
							this.publications = response.publications;
						}else {
							var arrayA = this.publications;
							var arrayB = response.publications;
							this.publications = arrayA.concat(arrayB);

							

							var that = this;
							setTimeout(function(){
								arrayB.forEach((pub, index) => {

									if(pub.tipo == 'video'){
										console.log(pub);
									const htmlContent = document.getElementById('video-youtube-'+pub._id);

									htmlContent.innerHTML = that.transformarEnlaceYoutube(htmlContent.innerHTML);
									}
				
									
								});
									

							}, 200);

							$(".muro-inicio").animate({scrollTop: $('.muro-inicio').prop("scrollHeight") - 130}, 700);
						}

						
					}else{
						this.status = 'error';
					}
				},
				error => {
					var errorMessage = <any>error;
					console.log(errorMessage);

					if(errorMessage != null){
						this.status = 'error';
					}
				}
			);
		}
	}

	public noMas = false;
	verMas(){
		this.page += 1;
		if(this.page == (this.pages)){
			this.noMas = true;
		}

		this.getPublicationsPaginado(this.page, true);
	}

	refresh(event = null){
		this.getPublicationsPaginado(1);
	}

	deletePublication(id){
		this._publicationService.deletePublication(this.token, id).subscribe(
			response => {
				this.refresh();
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	getBeats(){
		var idUsuario;
		if(this.identity) {
			idUsuario = this.identity._id;
		} else {
			idUsuario = '';
		}
		this._beatService.getBeats(idUsuario).subscribe(
			response => {
				if(response.beats){
					this.total = response.total;
					this.beats = response.beats;

				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	startPlayer(beat){
		let beat_player = JSON.stringify(beat);
		let file_path = this.url + 'get-audio-beat/' + beat.file;

		let image_beat_path = this.url + 'get-imagen-beat/' + beat.image;
		// let image_user_path = this.url + 'get-image-user/' + beat.user.image;

		localStorage.setItem('beat_sonando', beat_player);

		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById("nombre-beat").innerHTML = beat.name;
		document.getElementById("autor-beat").innerHTML = beat.user.nick;
		document.getElementById("img-beat").setAttribute("src", image_beat_path);

		$(".track").removeClass('track-activo');
		$(".notification-icon").removeClass('icono-pause');
		$("#icono-play"+beat._id+"").toggleClass('icono-pause');

	}

	startGrabacion(impro){
		let beat_player = JSON.stringify(impro.beat);
		let file_path = this.url + 'get-audio-beat/' + impro.beat.file;

		let image_beat_path = this.url + 'get-imagen-beat/' + impro.beat.image;
		// let image_user_path = this.url + 'get-image-user/' + beat.user.image;

		localStorage.setItem('beat_sonando', beat_player);

		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();

		document.getElementById("nombre-beat").innerHTML = impro.beat.name;
		document.getElementById("autor-beat").innerHTML = impro.beat.user.nick;
		document.getElementById("img-beat").setAttribute("src", image_beat_path);

		$(".track").removeClass('track-activo');
		$(".notification-icon").removeClass('icono-pause');
		$("#icono-play"+impro._id+"").toggleClass('icono-pause');

	}

	getGrabaciones(){
		this._grabacionService.getGrabaciones().subscribe(
			response => {
				if(response.grabaciones){
					this.totalGrabaciones = response.total;
					this.grabaciones = response.grabaciones;

				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	getComentariosPub(id){
		this._comentarioService.getComentariosPublicacion(id).subscribe(
			response => {
				if(response.comentarios){
					this.totalComentariosPub = response.total;
					this.comentariosPub = response.comentarios;

				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	mostrarComentariosPublicacion(id){
		this.getComentariosPub(id);
		$(".comments-list").css("display", "none");
		$("#comentarios-"+id).css("display", "inline-block");
	}

	createYoutubeEmbed(key){
		return '<iframe width="420" height="220" src="https://www.youtube.com/embed/' + key + '" frameborder="0" allowfullscreen></iframe><br/>';
	};
	  
	transformarEnlaceYoutube(text) {
		if (!text) return text;
		const self = this;
		
		const linkreg = /(?:)<a([^>]+)>(.+?)<\/a>/g;
		const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
		const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
		
		let resultHtml = text;  
		
		// get all the matches for youtube links using the first regex
		const match = text.match(fullreg);
		if (match && match.length > 0) {
			// get all links and put in placeholders
			const matchlinks = text.match(linkreg);
			if (matchlinks && matchlinks.length > 0) {
			for (var i=0; i < matchlinks.length; i++) {
				resultHtml = resultHtml.replace(matchlinks[i], "#placeholder" + i + "#");
			}
			}
		
			// now go through the matches one by one
			for (var i=0; i < match.length; i++) {
			// get the key out of the match using the second regex
			let matchParts = match[i].split(regex);
			// replace the full match with the embedded youtube code
			resultHtml = resultHtml.replace(match[i], self.createYoutubeEmbed(matchParts[1]));
			}
		
			// ok now put our links back where the placeholders were.
			if (matchlinks && matchlinks.length > 0) {
			for (var i=0; i < matchlinks.length; i++) {
				resultHtml = resultHtml.replace("#placeholder" + i + "#", matchlinks[i]);
			}
			}
		}
		return resultHtml;
	};


	public likePublicationOver;
	mouseEnter(publication_id){
		this.likePublicationOver = publication_id;
	}

	mouseLeave(publication_id){
		this.likePublicationOver = 0;
	}

	cargarSocket(){
		var that = this;

		this.socket.on('publication', function(publication){
			console.log(publication);

			that.getPubsMeGustan(this.page);

			that.render(publication);

		});
	}  
	
	render(publication){
		let likesPub = publication.likes;
		// this.likes = publicationsMeGustan;

		if(likesPub == 0){
			document.querySelector(".likes-pub-"+publication._id).innerHTML = 'Se el primero en dar +1';
		} else if(likesPub == 1){
			document.querySelector(".likes-pub-"+publication._id).innerHTML = 'A '+likesPub+' persona le gusta esto';
		} else {
			document.querySelector(".likes-pub-"+publication._id).innerHTML = 'A '+likesPub+' personas les gusta esto';
		}
		

	}

	
	addLikePublicacion(pub){
		console.log(pub);

		this.likes.push(pub);
		console.log(this.likes);
		this.getPubsMeGustan(this.page);

		this.socket.emit('add-like-pub', pub, this.identity._id);
		
		return false;
	}

	borrarLikePublicacion(idPub){
		console.log(idPub);

		var search = this.likes.indexOf(idPub);
		if(search != -1){
			this.likes.splice(search,	1);
		}
		this.getPubsMeGustan(this.page);

		this.socket.emit('delete-like-pub', idPub, this.identity._id);
		
		return false;
		
	}

	getPubsMeGustan(page){
		this._publicationService.getPublicationsPaginado(this.token, page).subscribe(
			response => {
				if(response.publications){

					this.likes = response.publications_me_gustan;
					console.log(this.likes);

					
				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}
	  
	  
}