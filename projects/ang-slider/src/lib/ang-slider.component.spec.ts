import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngSliderComponent } from './ang-slider.component';

describe('AngSliderComponent', () => {
  let component: AngSliderComponent;
  let fixture: ComponentFixture<AngSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
