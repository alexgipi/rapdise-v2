import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'inicio-no-login',
  templateUrl: './inicio-no-login.component.html',
  providers: [UserService]
})
export class InicioNoLoginComponent implements OnInit {
  public title:string;
  public identity;
  public url: string;
  public status:string;
  public stats;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService
  ){
    this.title = 'Inicio no login';
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    console.log('inicio-no-login.component cargado');
    $(".footer").css("display", "none");
    $("body").addClass("pagina-home");

    
    
    // $(".menu-home nav .btn-menu-home").click(function(e){
    //     e.preventDefault();

    //     $("html, body").animate({
    //         scrollTop: $($(this).attr('href')).offset().top
    //     });

    //     return false;
    // })

    // this.controlarSeccionActiva();
  }


  ngOnDestroy(){
    $("body").removeClass("pagina-home");
  }

  activarMenuHome(id) {
    // $("#"+id).addClass("activo");
  }

  controlarSeccionActiva(){
    //scrollSpy function
    function scrollSpy() {
      var sections = ['1', '2', '3', '4', '5', '6', '7'];
      var current;
      for (var i = 0; i < sections.length; i++) {
        if ( $('#'+sections[i]).offset().top-45 <= $(window).scrollTop() ) {
          current = sections[i];

          if(current == '1'){
            console.log("estas en el 1");
          } else if (current == '2'){
            console.log("estas en el 2");
            $(".menu-home").addClass("menu-negro");
          } else if (current == '3'){
            console.log("estas en el 3");
          } else if (current == '4'){
            console.log("estas en el 4");
          } else if (current == '5'){
            console.log("estas en el 5");
          } else if (current == '6'){
            console.log("estas en el 6");
          } else if (current == '7'){
            console.log("estas en el 7");
          }
        }
      }
      $("a[href='#"+current+"']").addClass('activo');
      $("a").not("a[href='#"+current+"']").removeClass('activo');      
    }


    //scrollSpy call
    $(document).ready( function() {
      scrollSpy();
    });
    $(window).scroll( function() {
      scrollSpy();
    });
        
  }


  abrirModalLogin(){
    $(".modal-login").addClass("activo");
  }

}
