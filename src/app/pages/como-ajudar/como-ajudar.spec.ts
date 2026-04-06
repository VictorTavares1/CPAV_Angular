import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoAjudar } from './como-ajudar';

describe('ComoAjudar', () => {
  let component: ComoAjudar;
  let fixture: ComponentFixture<ComoAjudar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoAjudar],
    }).compileComponents();

    fixture = TestBed.createComponent(ComoAjudar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
