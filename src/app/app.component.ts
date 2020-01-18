import { Component } from '@angular/core';
import { Config, ThumbTypes, TooltipTypes } from 'projects/ang-slider/src/lib/ang-slider.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public disabled = false;

  public config = {
    min: 0,
    max: 100,
    height: 10,
    width: 800,
    thumbWidth: 20,
    thumbHeight: 50,
    fillColor: '#bbbbbb',
    backgroundColor: 'orange',
    tooltipType: 'balloon',
    enableTooltip: true,
    enableTicks: true,
  };
  public config1: Config = {
    min: 55,
    max: 150,
    height: 10,
    width: 300,
    fillColor: '#a50000',
    backgroundColor: '#ffa5a5',
    thumbWidth: 14,
    thumbHeight: 14,
    thumbType: ThumbTypes.Circle,
    tooltipType: TooltipTypes.Balloon,
    enableTooltip: true,
    enableTicks: true,
    enableTickLabels: false,
    tickNumber: 10,
    showTooltipOnSlide: true,
    ariaLabel: 'slider with config',
  };
  public config2 = {
    width: 200,
  };
  public value: number;
  public label: string;
  public value2: number;

  public onButtonClick() {
    this.value = this.value - 10;
  }

  public onButtonClick3() {
    this.value2 = 105;
  }

  public onButtonClick2() {
    console.log(this.value2);
  }

  public onSlide(event: number) {
    console.log(event);
    this.value = event;
  }

  public onChange(event: number) {
    console.log('change', event);
    this.value = event;
  }

  public getTooltipLabel(val: number) {
    return `$${Math.round(val)}`;
  }

  public onDisable() {
    this.disabled = !this.disabled;
  }
}
