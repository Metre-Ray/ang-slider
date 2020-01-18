import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngSliderComponent } from './ang-slider.component';

@NgModule({
  declarations: [AngSliderComponent],
  imports: [
    CommonModule,
  ],
  exports: [AngSliderComponent]
})
export class AngSliderModule { }
