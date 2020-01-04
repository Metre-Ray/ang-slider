import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngSliderModule } from 'projects/ang-slider/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
