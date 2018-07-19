# ngx-select-carousel
Angular 6+ Select List (Combo) Carousel Using CSS 3D transformations 

This component was made to replace a listbox, with touch suport using a vertical 3D carousel;

Example:

    HTML:
    <div style="width: 200px; height: 200px;">
        <ngx-select-carousel [data]="dataArray" ([selected])="arrayElementSelected" (onSelectedChanged)="handler($event)"></ngx-select-carousel>
    </div>

    TS:
    import { ICarouselData } from 'ngx-select-carousel';

    dataArray: Array<ICarouselData> = [{id:"0", value: "Option 0 Label" }, { value: "Option without Id" }];

Repository: https://github.com/viniciusmiguel/ngx-select-carousel