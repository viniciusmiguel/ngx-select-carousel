import { Component, ViewEncapsulation, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'ngx-select-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class CarouselComponent implements AfterViewInit {
  @Input("data") data: Array<ICarouselData>;
  @Input("font-size") fontSize: number = 10;
  @Input("font-family") fontFamily: string = "Arial";
  @Input("options-displayed") optionsDisplayed: number = 5;
  @Input("element-height") elementHeight: number = 30;
  @Input("selected")
  get selected(): ICarouselData {
    return this.data[this._currentItemIndex];
  }
  set selected(value: ICarouselData) {
    if(value == null ) return;
    if(this.data != null)
    {
      let i = this.data.indexOf(value);
      if(i >=0)
        this._currentItemIndex = i;
    }
      
  }
  @Output("onSelectedChanged") onSelectedChanged: EventEmitter<ICarouselData>;
  
  @ViewChild("carousel", {read: ElementRef}) carousel: ElementRef;
  @ViewChild("area", {read: ElementRef}) area: ElementRef;
  @ViewChild("up", {read: ElementRef}) upDiv: ElementRef;
  @ViewChild("down", {read: ElementRef}) downDiv: ElementRef;
  @ViewChild("canvas", {read: ElementRef}) private _canvasRef: ElementRef;

  private _currentItemIndex: number =0;
  private _items: any;
  private _theta: number;
  constructor() { 
    this.onSelectedChanged = new EventEmitter<ICarouselData>();
  }

  ngAfterViewInit() {
    this._items = this.area.nativeElement.children;
    this._theta = 365 / (this.optionsDisplayed *2);
    this._setupCarousel();
    window.addEventListener('resize',()=> {
      this._setupCarousel();
    });
  }
  private _setupCarousel() {
    let ch = parseFloat(getComputedStyle(this.carousel.nativeElement).height);
    let size = (ch -  this.elementHeight)/2;
    this.upDiv.nativeElement.style.height = size + "px";
    this.downDiv.nativeElement.style.height = size + "px";
    var apothem = ch/2;
    this.area.nativeElement.style.height = this.elementHeight;
    this.area.nativeElement.style.transformOrigin = "center center -" + apothem + "px";
    for(let i =0; i < this._items.length; i++) {
      this._items[i].style.transformOrigin = "center center -" + apothem  + "px";
      this._items[i].style.transform = "rotateX(" + (i * (this._theta)) + "deg)";
      if(i > this._currentItemIndex - (this.optionsDisplayed/2) && i < this._currentItemIndex + (this.optionsDisplayed/2))
          this._items[i].style.visibility = "visible";
        else
          this._items[i].style.visibility = "hidden";
    }    
  }
  private _onSelectedChanged(data: ICarouselData) {
    this.onSelectedChanged.emit(data);
  }
  _up() {
   if(this._currentItemIndex < this.data.length-1)
      this._currentItemIndex++;
    for(let i = 0 ; i < this._items.length;i++ ) {
      if(i >= this._currentItemIndex - (this.optionsDisplayed/2) && i <= this._currentItemIndex + (this.optionsDisplayed/2))
        this._items[i].style.visibility = "visible";
      else
        this._items[i].style.visibility = "hidden";
    }
    
    this.area.nativeElement.style.transform = "rotateX(" + (this._currentItemIndex * -this._theta)+"deg)";
    this._onSelectedChanged(this.data[this._currentItemIndex]);
  }
  _down() {
    if(this._currentItemIndex>0)
       this._currentItemIndex--;
       for(let i = 0 ; i < this._items.length;i++ ) {
        if(i > this._currentItemIndex - (this.optionsDisplayed/2) && i < this._currentItemIndex + (this.optionsDisplayed/2))
          this._items[i].style.visibility = "visible";
        else
          this._items[i].style.visibility = "hidden";
       }
     this.area.nativeElement.style.transform = "rotateX(" + (this._currentItemIndex * -this._theta)+"deg)";
     this._onSelectedChanged(this.data[this._currentItemIndex]);
   }
  private _textToImage(txt: string): any {
    let context: CanvasRenderingContext2D = this._canvasRef.nativeElement.getContext('2d');
    context.font = this.fontSize + "px " + this.fontFamily;
    context.canvas.width = context.measureText(txt).width;
    context.canvas.height = this.elementHeight;
    context.fillStyle="#111";
    context.fillText(txt, 0, (this.elementHeight/2));
    return context.canvas.toDataURL();
  }
}

export interface ICarouselData {
  id?: string;
  value: string;
}