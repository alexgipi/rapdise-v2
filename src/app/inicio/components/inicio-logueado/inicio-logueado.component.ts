import { Component, OnInit, DoCheck, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

export interface Beat {
  id: Number,
  titulo: String,
  autor: String,
  imgPerfil: String,
  estilos: String,
  caratula: String,
}

@Component({
  selector: 'inicio-logueado',
  templateUrl: './inicio-logueado.component.html',
  styleUrls:  ['./inicio-logueado.css'],
  providers: [UserService]
})
export class InicioLogueadoComponent implements OnInit {
  public titulo:string;
  public identity;
  public token;
  public url: string;
  public status:string;

  public beats: Beat[] = [
    {
      "id": 1,
      "titulo": "Stuck In A Dream (feat. Gunna)",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#OldSchool #Underground",
      "caratula": "https://i1.sndcdn.com/artworks-SLi3DRtVUIgd-0-t500x500.jpg",
    },
    {
      "id": 2,
      "titulo": "Love Me More",
      "autor": "KAPO 013 BARCELONA",
      "imgPerfil": "https://yt3.ggpht.com/a/AGF-l7-usCpVpi4SwaUO9oRNZbnOpHpcSPKQ-SRWww=s48-c-k-c0xffffffff-no-rj-mo",
      "estilos": "#BoomBap #Jazzy",
      "caratula": "https://i1.sndcdn.com/artworks-000627582724-p835rv-t500x500.jpg",
    },
    {
      "id": 3,
      "titulo": "Bandit ft. NBA Youngboy",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#Trap",
      "caratula": "https://i1.sndcdn.com/artworks-000607413409-8kknp0-t500x500.jpg",
    },
    {
      "id": 4,
      "titulo": "Camelot",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#OldSchool #BoomBap",
      "caratula": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
    },
    {
      "id": 5,
      "titulo": "Stuck In A Dream (feat. Gunna)",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#OldSchool #Underground",
      "caratula": "https://i1.sndcdn.com/artworks-SLi3DRtVUIgd-0-t500x500.jpg",
    },
    {
      "id": 6,
      "titulo": "Love Me More",
      "autor": "KAPO 013 BARCELONA",
      "imgPerfil": "https://yt3.ggpht.com/a/AGF-l7-usCpVpi4SwaUO9oRNZbnOpHpcSPKQ-SRWww=s48-c-k-c0xffffffff-no-rj-mo",
      "estilos": "#BoomBap #Jazzy",
      "caratula": "https://i1.sndcdn.com/artworks-000627582724-p835rv-t500x500.jpg",
    },
    {
      "id": 7,
      "titulo": "Bandit ft. NBA Youngboy",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#Trap",
      "caratula": "https://i1.sndcdn.com/artworks-000607413409-8kknp0-t500x500.jpg",
    },
    {
      "id": 8,
      "titulo": "Camelot",
      "autor": "alexgp895",
      "imgPerfil": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
      "estilos": "#OldSchool #BoomBap",
      "caratula": "https://i1.sndcdn.com/artworks-000596445971-jh3py0-t500x500.jpg",
    }
  ]

 

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService,
  ){
  	this.titulo = 'Inicio';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

    ngOnInit(){
        console.log('inicio.component cargado');
        $(".footer").css("display", "none");
        
    }

    reproducirBeat(){
      $("body").addClass("barra-reproductor-general-visible");
    }

    slider(){
      $('.slide-nav').on('click', function(e) {
        e.preventDefault();
        // get current slide
        var current = $('.flex--active').data('slide'),
          // get button data-slide
          next = $(this).data('slide');
      
        $('.slide-nav').removeClass('active');
        $(this).addClass('active');
      
        if (current === next) {
          return false;
        } else {
          $('.slider__warpper').find('.flex__container[data-slide=' + next + ']').addClass('flex--preStart');
          $('.flex--active').addClass('animate--end');
          setTimeout(function() {
            $('.flex--preStart').removeClass('animate--start flex--preStart').addClass('flex--active');
            $('.animate--end').addClass('animate--start').removeClass('animate--end flex--active');
          }, 800);
        }
      });
    }

}
