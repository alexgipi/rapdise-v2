import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { Follow } from '../../../models/follow';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'ranking-beats',
  templateUrl: './ranking-beats.component.html',
  providers: [UserService, FollowService]
})

export class RankingBeatsComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public page;
	public next_page;
	public prev_page;
	public total;
	public pages;
	public users: User[];
	public follows;
	public status: string;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){
		this.titulo = 'Ranking de beats';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('Componente Users cargado!');
		$(".bootstrap-select").find("div.btn-group").css("display", "none");
		// document.body.style.background = "url('assets/fondo.png') fixed";
		// document.body.style.backgroundSize = "cover";
		this.getUsers();
		// $("html, body").animate({ scrollTop: 0 }, 400);
	}

	ngOnDestroy(){
    	// document.body.style.background = "#edf2f6";
  	}

	getUsers(){
		if(this.identity){
			this._userService.getUsersYSeguidores(this.identity._id).subscribe(
				response => {
					if(!response.users){
						this.status = 'error';
					}else {
						this.users = response.users;
						this.follows = response.users_following;

						console.log(this.users);
						console.log(this.follows);
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
		}else {
			this._userService.getUsers().subscribe(
				response => {
					if(!response.users){
						this.status = 'error';
					}else {
						this.users = response.users;

						console.log(this.users);
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

	public followUserOver;
	mouseEnter(user_id){
		this.followUserOver = user_id;
	}

	mouseLeave(user_id){
		this.followUserOver = 0;
	}

	followUser(followed){
		var follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if(!response.follow){
					this.status = 'error';
				}else {
					this.status = 'success';
					this.follows.push(followed);
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

	unfollowUser(followed){
		var follow = new Follow('', this.identity._id, followed);

		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				var search = this.follows.indexOf(followed);
				if(search != -1){
					this.follows.splice(search,	1);
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

	mostrarCard(event){
		var idCard = event.target.id;
		$("#card-usuario-"+idCard+"").toggleClass("mc-active");
		$(".control-block-button #"+idCard+"").fadeOut(0).fadeIn();
	}
}
