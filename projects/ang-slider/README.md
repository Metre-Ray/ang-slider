# AngSlider

Slider built with Angular 8.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

## Examples


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

`config` interface: 
```
interface Config {
  min: number;
  max: number;
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
  tickLabels?: string[];
  showTooltipOnSlide?: boolean;
  showBorderValues?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
```

Default `config`:
```
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


### Required
  TODO

### Optional
  TODO

## Setting styles

Parameters in `config` are more important than styles.

Example of setting colors of the fill and the thumb (but to apply this styles you need fillColor and backgroundColor in config to be empty rows):
```
ang-slider::ng-deep {
  .thumb {
    background-color: blue;
  }
  .slider-fill {
    background-color: blue;
  }
}
```

## Notes

For custom thumb use styles and thumbType: 'custom'.
In case of angles 90 or -90 height of the slider is determined by width of the slider.


Further is default info from angular.

## Code scaffolding

Run `ng generate component component-name --project ang-slider` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ang-slider`.
> Note: Don't forget to add `--project ang-slider` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ang-slider` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ang-slider`, go to the dist folder `cd dist/ang-slider` and run `npm publish`.
