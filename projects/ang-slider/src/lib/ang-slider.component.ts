import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit
} from '@angular/core';

export enum TooltipTypes {
  Rect = 'rectangle',
  Balloon = 'balloon',
  Text = 'text',
  Custom = 'custom',
}

export enum ThumbTypes {
  Rect = 'rectangle',
  Circle = 'circle',
  Square = 'square',
  Custom = 'custom',
  None = 'none',
}

export interface Config {
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
  tickStep?: number;  // TODO
  tickPositions?: number[]; // TODO
  showTooltipOnSlide?: boolean;
  showBorderValues?: boolean;
  sliderStyle?: string; // TODO
  disabled?: boolean;
  ariaLabel?: string;
  revert?: boolean;  // TODO
}

const defaultConfig: Config = {
  min: 0,
  max: 100,
  fillColor: 'rgb(2, 0, 97)',
  backgroundColor: 'rgb(181, 176, 255)',
  enableTooltip: true,
  tooltipType: TooltipTypes.Rect,
  thumbType: ThumbTypes.Rect,
};

@Component({
  selector: 'ang-slider',
  templateUrl: './ang-slider.component.html',
  styleUrls: ['./ang-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngSliderComponent implements OnChanges, AfterViewInit {
  @Input() public value = 0;
  @Input() public config: Config = defaultConfig;
  @Input() public getTooltipLabel: (val: string | number) => string;
  @Input() public tickLabels: string[] | number[];
  @Input() public disabled: boolean;
  @Input() public degree: number = 0;  // from -90 to 90
  @Output() public change = new EventEmitter();
  @Output() public slide = new EventEmitter();
  @Output() public valueChange = new EventEmitter();

  public tickNumber = 5;
  public tooltipLabel: string | number;
  public empty = () => {};
  private slider: HTMLElement;
  private thumb: HTMLElement;
  private fill: HTMLElement;
  private tooltip: HTMLElement;
  private ticks: HTMLElement[];
  private ticksContainer: HTMLElement;
  private tickLabelsContainer: HTMLElement;
  private ticksPosition: number[];

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private ref: ElementRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.previousValue !== this.value && this.slider) {
      this.setSliderPositionFromValue(this.value, false);
    }
    if (changes.config) {
      this.config = {...defaultConfig, ...changes.config.currentValue};
      if (this.slider) {
        this.setStylesFromConfig();
      }
    }
    if (changes.disabled !== undefined && this.slider) {
      this.disable();
    }
  }

  ngAfterViewInit() {
    const element = this.ref.nativeElement;
    this.slider = element.querySelector('.slider');
    this.thumb = element.querySelector('.thumb');
    this.fill = element.querySelector('.slider-fill');
    this.tooltip = element.querySelector('.tooltip');
    this.ticksContainer = element.querySelector('.ticks-container');
    this.tickLabelsContainer = element.querySelector('.labels-container');
    this.ticks = element.querySelectorAll('.tick');
    this.checkConfig();
    this.addClassToFixFocusStyles(element);
    this.setStylesFromConfig();
    this.setThumbToStartPosition();
    this.setTickStyles(this.valueToPosition(this.config.min), true);
    this.disable();
  }

  public get ticksArray() {
    if (this.config.tickNumber) {
      return Array(this.config.tickNumber).fill('');
    }
    return;
  }

  public onWindowResize() {
    this.setStylesFromConfig();
    this.setSliderPositionFromValue(this.value);
    this.setTickStyles(this.valueToPosition(this.value), true);
  }

  public onSliderClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList[0] === 'thumb') {
      return;
    }
    const newLeft = this.getNewSliderPositionFromEvent(event);
    this.setSliderPositionFromCoordinate(newLeft);
    this.change.emit(this.value);
    this.valueChange.emit(this.value);
  }

  public onKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 39:    // right arrow
      case 38:    // up arrow
      case 33:    // page up
        this.changeValue(1);
        break;
      case 37:    // left arrow
      case 40:    // down arrow
      case 34:    // page down
        this.changeValue(-1);
        break;
      case 36:    // home
        this.setSliderPositionFromValue(this.config.min, true);
        break;
      case 35:    // end
        this.setSliderPositionFromValue(this.config.max, true);
        break;
      default:
        break;
    }
  }

  public onMouseDown(event: MouseEvent) {
    event.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private addClassToFixFocusStyles(element: HTMLElement) {
    element.addEventListener('mousedown', () => {
      this.slider.classList.add('using-mouse');
    });
    element.addEventListener('keyup', () => {
      this.slider.classList.remove('using-mouse');
    });
  }

  private valueToPosition(value: number): number {
    const width = this.slider.clientWidth;
    const offset = -this.thumb.offsetWidth / 2;
    const { min, max } = this.config;
    let position: number;
    if (value <= min) {
      position = offset;
    } else if (value >= max) {
      position = offset + width;
    } else {
      position = offset + (width) * ((value - min) / (max - min));
    }
    return position;
  }

  private positionToValue(position: number): number {
    // position - position on slider counting from its left border
    const width = this.slider.clientWidth;
    const offset = -this.thumb.offsetWidth / 2;
    const rightBorder = width + offset;
    const { min, max } = this.config;
    let value: number;
    if (position <= offset) {
      value = min;
    } else if (position >= rightBorder) {
      value = max;
    } else {
      value = (position - offset) / (width) * (max - min) + min;
    }
    return value;
  }

  private setSliderPositionFromValue(value: number, shouldEmit: boolean = false) {
    const position = this.valueToPosition(value);
    this.setValue(value);
    this.setSliderPosition(position);
    this.setTickStyles(position);
    if (shouldEmit) {
      this.change.emit(this.value);
      this.valueChange.emit(this.value);
    }
  }

  private setSliderPositionFromCoordinate(position: number) {
    const value = this.positionToValue(position);
    this.setValue(value);
    this.setSliderPosition(position);
    this.setTickStyles(position);
  }

  private setSliderPosition(position: number) {
    this.renderer.setStyle(this.thumb, 'left', `${position}px`);
    this.renderer.setStyle(this.fill, 'width', `${position + this.thumb.offsetWidth / 2}px`);
    this.setTooltipPositionAndLabel(position);
  }

  private setTooltipPositionAndLabel(position: number, value?: number): void {
    if (this.config.enableTooltip) {
      this.renderer.setStyle(this.tooltip, 'left', `${position + this.thumb.offsetWidth / 2}px`);
      if (this.getTooltipLabel) {
        this.tooltipLabel = this.getTooltipLabel(value || this.positionToValue(position));
      } else {
        this.tooltipLabel = Math.round(value || this.positionToValue(position));
      }
      this.changeDetector.detectChanges();
    }
  }

  private getNewSliderPositionFromEvent(event: MouseEvent): number {
    const sliderBox = this.slider.getBoundingClientRect();
    const origin = [sliderBox.left, sliderBox.bottom];
    const degree = this.toRadians(this.degree < 0 ? -this.degree : this.degree);
    const alpha = this.toRadians(90) - degree;
    const offsetX = (this.thumb.offsetWidth / 2) * Math.sin(alpha);
    const offsetY = (this.thumb.offsetWidth / 2) * Math.cos(alpha);

    const leftEdge = -this.thumb.offsetWidth / 2;
    const rightEdge = this.slider.offsetWidth - this.thumb.offsetWidth / 2;

    let newX: number;
    let newY: number;
    if (Math.abs(this.degree) <= 45) {                     // -45 to 45
      newX = event.clientX - origin[0] - offsetX;
      newY = newX * Math.tan(degree);
    } else if (this.degree < -45 && this.degree >= -90) {  // -45 to -90 - movement from bottom to top
      newY = origin[1] - event.clientY - offsetY;
      newX = newY / Math.tan(degree);
    } else if (this.degree > 45) {                         // 45 to 90 - movement from top to bottom (we need to divide on tan)
      newY = event.clientY - sliderBox.top - offsetY;
      newX = newY / Math.tan(degree);
    }

    let newLeftPosition = Math.sqrt(newX ** 2 + newY ** 2);

    if ((newX < 0 && newY <= 0) || (this.degree === -90 && newY < 0) || (this.degree === 90 && newY < 0)) {
      newLeftPosition = -newLeftPosition;
    }
    if (newLeftPosition < leftEdge) {
      newLeftPosition = leftEdge;
    }
    if (newLeftPosition > rightEdge) {
      newLeftPosition = rightEdge;
    }
    return newLeftPosition;
  }

  private setTickStyles(thumbPosition: number, determinePositions?: boolean): void {
    if (this.ticks && determinePositions) {
      this.determibeTicksPosition();
    }
    if (this.ticksPosition) {
      this.ticksPosition.forEach((pos: number, ind: number) => {
        if (pos < thumbPosition) {
          this.renderer.setStyle(this.ticks[ind], 'background', this.config.fillColor);
        } else {
          this.renderer.setStyle(this.ticks[ind], 'background', this.config.backgroundColor);
        }
      });
    }
  }

  private determibeTicksPosition() {
    if (this.ticks) {
      this.ticksPosition = [];
      this.ticks.forEach((tick: HTMLElement) => {
        const tickPos = this.calculateTickPosition(tick);
        this.ticksPosition.push(tickPos);
      });
    }
  }

  private calculateTickPosition(tick: HTMLElement) {
    const tickBox = tick.getBoundingClientRect();
    const containerBox = this.ticksContainer.getBoundingClientRect();
    const offset = this.thumb.offsetWidth / 2;

    let xPos: number;
    let yPos: number;
    if (this.degree <= 0 && this.degree >= -90) {
      xPos = tickBox.left - containerBox.left;
      yPos = tickBox.bottom - containerBox.bottom;
    } else if (this.degree > 0) {
      xPos = tickBox.left - containerBox.left;
      yPos = tickBox.top - containerBox.top;
    }

    const tickPos = Math.sqrt(xPos ** 2 + yPos ** 2) - offset;

    return tickPos;
  }

  private changeValue(num: number) {
    const step = (this.config.max - this.config.min) / 20;
    this.setValue(this.value + num * step);
    this.setSliderPositionFromValue(this.value, true);
  }

  private onMouseMove = (event: MouseEvent) => {
    const newPosition = this.getNewSliderPositionFromEvent(event);
    this.setSliderPositionFromCoordinate(newPosition);
    this.slide.emit(this.value);
    this.valueChange.emit(this.value);
  }

  private onMouseUp = () => {
    this.change.emit(this.value);
    this.valueChange.emit(this.value);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  private checkConfig() {
    if (Math.abs(this.degree) > 90) {
      console.log('degree must be in range from -90 to 90');
      this.degree = 0;
    }
  }

  private setStylesFromConfig(): void {
    if (this.config.height) {
      this.renderer.setStyle(this.slider, 'height', `${this.config.height}px`);
    }
    if (this.config.width) {
      this.renderer.setStyle(this.slider, 'width', `${this.config.width}px`);
    }
    if (this.config.thumbWidth) {
      this.renderer.setStyle(this.thumb, 'width', `${this.config.thumbWidth}px`);
    }
    if (this.config.thumbHeight) {
      this.renderer.setStyle(this.thumb, 'height', `${this.config.thumbHeight}px`);
      this.renderer.setStyle(this.thumb, 'top', `-${this.thumb.offsetHeight / 2 - this.slider.clientHeight / 2}px`);
      if (this.config.enableTooltip) {
        this.renderer.setStyle(this.tooltip, 'top', `-${this.config.thumbHeight / 2 - this.slider.clientHeight / 2 + 27}px`);
      }
    }
    if (this.tickLabels && this.config.enableTickLabels) {
      const labelWidth = (this.slider.clientWidth) / (this.tickLabels.length - 1);
      this.renderer.setStyle(this.tickLabelsContainer, 'width',
        `${labelWidth * this.tickLabels.length}px`);
      this.renderer.setStyle(this.tickLabelsContainer, 'margin-left',
        `-${labelWidth / 2}px`);
    }
    if (this.config.enableTooltip) {
      this.setTooltipType();
    }
    if (this.config.showTooltipOnSlide) {
      this.renderer.addClass(this.thumb, 'show-on-slide');
    }
    this.setColors();
    this.setThumbType();
    this.setDegree();
  }

  private setValue(val: number) {
    if (val > this.config.max) {
      this.value = this.config.max;
    } else if (val < this.config.min) {
      this.value = this.config.min;
    } else {
      this.value = val;
    }
  }

  // private getValue(): number {
  //   return this.value;
  // }

  private setColors() {
    if (this.config.fillColor && !this.disabled) {
      if (this.config.thumbType !== ThumbTypes.Custom) {
        this.renderer.setStyle(this.thumb, 'background-color', this.config.fillColor);
      }
      if (this.tooltip && (this.config.tooltipType === TooltipTypes.Rect || this.config.tooltipType === TooltipTypes.Balloon)) {
        this.renderer.setStyle(this.tooltip, 'background-color', this.config.fillColor);
      }
      this.renderer.setStyle(this.fill, 'background-color', this.config.fillColor);
    }
    if (this.config.backgroundColor && !this.disabled) {
      this.renderer.setStyle(this.slider, 'background-color', this.config.backgroundColor);
    }
  }

  private setThumbType() {
    if (this.config.thumbType) {
      switch (this.config.thumbType) {
        case ThumbTypes.Circle:
          this.renderer.addClass(this.thumb, 'circle');
          this.renderer.setStyle(this.thumb, 'width', `${this.thumb.clientHeight}px`);
          break;
        case ThumbTypes.Square:
          this.renderer.setStyle(this.thumb, 'width', `${this.thumb.clientHeight}px`);
          break;
        case ThumbTypes.None:
          this.renderer.addClass(this.thumb, 'no-thumb');
          break;
        default:
          break;
      }
    }
  }

  private setTooltipType() {
    switch (this.config.tooltipType) {
      case TooltipTypes.Rect:
        this.renderer.addClass(this.tooltip, 'tooltip-rectangle');
        break;
      case TooltipTypes.Balloon:
        this.renderer.addClass(this.tooltip, 'tooltip-balloon');
        break;
      default:
        break;
    }
  }

  private setThumbToStartPosition() {
    this.setSliderPositionFromValue(this.config.min);
    this.setTooltipPositionAndLabel(this.valueToPosition(this.config.min), this.value);
  }

  private disable() {
    if (this.disabled) {
      this.renderer.addClass(this.slider, 'disabled');
      this.renderer.removeStyle(this.slider, 'background-color');
      this.renderer.removeStyle(this.thumb, 'background-color');
      this.renderer.removeStyle(this.fill, 'background-color');
      if (this.config.tooltipType === TooltipTypes.Rect || this.config.tooltipType === TooltipTypes.Balloon) {
        this.renderer.removeStyle(this.tooltip, 'background-color');
      }
    } else if (this.disabled === false) {
      this.renderer.removeClass(this.slider, 'disabled');
      this.setColors();
    }
  }

  private setDegree() {
    if (this.degree || this.degree === 0) {
      this.renderer.setStyle(this.slider, 'transform', `rotate(${this.degree}deg)`);
    }
  }

  private toRadians(angle: number): number {
    return angle * (Math.PI / 180);
  }

}
