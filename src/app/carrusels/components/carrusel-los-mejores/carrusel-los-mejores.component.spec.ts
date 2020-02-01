import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselUsuariosDestacadosComponent } from './carrusel-usuarios-destacados.component';

describe('CarruselUsuariosDestacadosComponent', () => {
  let component: CarruselUsuariosDestacadosComponent;
  let fixture: ComponentFixture<CarruselUsuariosDestacadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarruselUsuariosDestacadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarruselUsuariosDestacadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
