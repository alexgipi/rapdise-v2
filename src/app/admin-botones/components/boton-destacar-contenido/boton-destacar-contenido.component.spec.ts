import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonDestacarBatallaComponent } from './boton-destacar-batalla.component';

describe('BotonDestacarBatallaComponent', () => {
  let component: BotonDestacarBatallaComponent;
  let fixture: ComponentFixture<BotonDestacarBatallaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonDestacarBatallaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonDestacarBatallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
