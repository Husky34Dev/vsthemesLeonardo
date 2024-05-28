import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextDirective, SliderDirective } from './helpers';
import { ColorPickerService } from './color-picker.service';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerDirective } from './color-picker.directive';
import './ng-dev-mode';
import * as i0 from "@angular/core";
export class ColorPickerModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerModule, declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective], imports: [CommonModule], exports: [ColorPickerDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerModule, providers: [ColorPickerService], imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [ColorPickerDirective],
                    providers: [ColorPickerService],
                    declarations: [ColorPickerComponent, ColorPickerDirective, TextDirective, SliderDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEUsT0FBTyxlQUFlLENBQUM7O0FBUXZCLE1BQU0sT0FBTyxpQkFBaUI7dUdBQWpCLGlCQUFpQjt3R0FBakIsaUJBQWlCLGlCQUZaLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxlQUFlLGFBSC9FLFlBQVksYUFDWixvQkFBb0I7d0dBSXBCLGlCQUFpQixhQUhqQixDQUFFLGtCQUFrQixDQUFFLFlBRnRCLFlBQVk7OzJGQUtaLGlCQUFpQjtrQkFON0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBRSxZQUFZLENBQUU7b0JBQ3pCLE9BQU8sRUFBRSxDQUFFLG9CQUFvQixDQUFFO29CQUNqQyxTQUFTLEVBQUUsQ0FBRSxrQkFBa0IsQ0FBRTtvQkFDakMsWUFBWSxFQUFFLENBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBRTtpQkFDN0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgVGV4dERpcmVjdGl2ZSwgU2xpZGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9oZWxwZXJzJztcblxuaW1wb3J0IHsgQ29sb3JQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9jb2xvci1waWNrZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb2xvclBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29sb3ItcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb2xvclBpY2tlckRpcmVjdGl2ZSB9IGZyb20gJy4vY29sb3ItcGlja2VyLmRpcmVjdGl2ZSc7XG5cbmltcG9ydCAnLi9uZy1kZXYtbW9kZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFsgQ29tbW9uTW9kdWxlIF0sXG4gIGV4cG9ydHM6IFsgQ29sb3JQaWNrZXJEaXJlY3RpdmUgXSxcbiAgcHJvdmlkZXJzOiBbIENvbG9yUGlja2VyU2VydmljZSBdLFxuICBkZWNsYXJhdGlvbnM6IFsgQ29sb3JQaWNrZXJDb21wb25lbnQsIENvbG9yUGlja2VyRGlyZWN0aXZlLCBUZXh0RGlyZWN0aXZlLCBTbGlkZXJEaXJlY3RpdmUgXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlck1vZHVsZSB7fVxuIl19