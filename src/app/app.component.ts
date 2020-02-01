import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { UserService } from './services/user.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'rapdise-nuevo';
  public token;
  public identity;

  public selectedLanguage = 'es';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private translateService: TranslateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    
    this.token = this._userService.getToken();
    this.translateService.setDefaultLang(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);

    iconRegistry.addSvgIcon(
      'micro-freestyle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/freestyle.svg')
    );
    iconRegistry.addSvgIcon(
      'espadas-batalla',
      sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/espadas-batalla.svg')
    );
    iconRegistry.addSvgIcon(
      'cono-entreno',
      sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/cono-entreno.svg')
    );
    iconRegistry.addSvgIcon(
      'disco-beats',
      sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/disco-beats.svg')
    );
  }

  ngOnInit() {
    console.log("Componente app-root cargado");
    this.identity = this._userService.getIdentity();
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);

  }

  toogleLanguage(lang: string) {
		this.translateService.use(lang);
  }
  
}
