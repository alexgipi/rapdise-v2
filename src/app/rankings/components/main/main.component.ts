import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

import { Beat } from '../../../models/beat';

export interface Estilo {
	value: string;
	viewValue: string;
}

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  providers: [UserService]
})
export class MainComponent implements OnInit, DoCheck {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;

  public rankingElegido = 'general';

  public estilos: Estilo[] = [
    {value: 'general', viewValue: 'General'},
		{value: 'bases', viewValue: 'Bases'},
		{value: 'batallas', viewValue: 'Batallas'},
		{value: 'freestyle', viewValue: 'Freestyle'}
	];


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService
  ){
  	this.title = 'Rankings';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
      console.log('main.component de rankings cargado');
      this.slider();
  }

  slider(){
    $('.slide-nav').on('click', function(e) {
      e.preventDefault();
      // get current slide
      var current = $('.slider-top-activo').data('slide'),
        // get button data-slide
        next = $(this).data('slide');
    
      $('.slide-nav').removeClass('activo');
      $(this).addClass('activo');
    
      if (current === next) {
        return false;
      } else {
        $('.slider__warpper').find('.item-slider-tops[data-slide=' + next + ']').addClass('flex--preStart');
        $('.slider-top-activo').addClass('animate--end');
        setTimeout(function() {
          $('.flex--preStart').removeClass('animate--start flex--preStart').addClass('slider-top-activo');
          $('.animate--end').addClass('animate--start').removeClass('animate--end slider-top-activo');
        }, 1200);
      }
    });
  }

  ngDoCheck(){
  	this.identity = this._userService.getIdentity();
  }

  cambiarRanking(tipoRanking){
    this.rankingElegido = tipoRanking;
  }

}