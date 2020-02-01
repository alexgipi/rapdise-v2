import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonDestacarUsuarioComponent } from './boton-destacar-usuario.component';

describe('BotonDestacarUsuarioComponent', () => {
  let component: BotonDestacarUsuarioComponent;
  let fixture: ComponentFixture<BotonDestacarUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonDestacarUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonDestacarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
