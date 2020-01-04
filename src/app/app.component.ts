import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public config1 = {
    width: 200,
  };

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
  public value: number;
  public label: string;
  public value2: number;

  public onButtonClick() {
    this.value = this.value - 10;
  }

  public onButtonClick3() {
    this.value2 = 17;
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
}
