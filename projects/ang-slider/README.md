# AngSlider

Slider built with Angular 8.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.


## Examples

https://stackblitz.com/edit/angular-vdwzit


## Installation and use

To install package run `npm i ang-slider`.

Example of usage:
```typescript
import { AngSliderComponent } from 'ang-slider';

@NgModule({
  imports:      [],
  declarations: [ AppComponent, AngSliderComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

```html
<ang-slider
  [(value)]="value"
  [config]="config"
  [getTooltipLabel]="getTooltipLabel"
  [disabled]="disabled"
></ang-slider>
```

## Parameters and events

### Input parameters


| Parameters    | Value type  | Example           | Description
| ------------- | ----------- | ----------------- | -------
| `config`      | object      |                   | object with configurations for slider
| `degree`      | number      |                   | degree on which slider must be rotated (from -90 to 90)
| `disabled`    | boolean     |                   | whether to disable slider
| `getTooltipLabel` | function|                   | function which gets value from slider as input and returns string which will be used as tooltip label
| `tickLabels`  | string[]    |                   | tick labels
| `value`       | number      |                   | value on slider
&nbsp;

`config` interface: 
```typescript
interface Config {
  min?: number;
  max?: number;
  height?: number;
  width?: number;
  fillColor?: string;
  backgroundColor?: string;
  thumbWidth?: number;
  thumbHeight?: number;
  thumbType?: ThumbTypes;
  tooltipType?: TooltipTypes;
  enableTooltip?: boolean;
  enableTicks?: boolean;
  enableTickLabels?: boolean;
  tickNumber?: number;
  showTooltipOnSlide?: boolean;
  showBorderValues?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
```

Default `config`:
```typescript
{
  min: 0,
  max: 100,
  fillColor: 'rgb(2, 0, 97)',
  backgroundColor: 'rgb(181, 176, 255)',
  enableTooltip: true,
  tooltipType: TooltipTypes.Rect,
  thumbType: ThumbTypes.Rect,
}
```

### Output events

`change` - is emitted on mouseup.

`slide` - is emitted on mousemove.

`valueChange` - is emitted in both cases.

You can use two-way data binding for `value`: `[(value)]="someValue"`.


## Setting styles

Parameters in `config` are more important than styles.

Example of setting colors of the fill and the thumb (but to apply this styles you need fillColor and backgroundColor in config to be empty rows):
```scss
ang-slider::ng-deep {
  .thumb {
    background-color: blue;
  }
  .slider-fill {
    background-color: blue;
  }
}
```

Available classes: `slider`, `thumb`, `tootlip`, `tooltip-text`, `slider-fill`, `ticks-container`, `tick`, `labels-container`, `tick-label`, `disabled`.

## Notes

For custom thumb use styles and thumbType: 'custom'.

In case of angles 90 or -90 height of the slider is determined by width of the slider.
