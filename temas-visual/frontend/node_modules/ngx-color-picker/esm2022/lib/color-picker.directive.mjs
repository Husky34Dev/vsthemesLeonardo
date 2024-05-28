import { Directive, Input, Output, EventEmitter, HostListener, Injector } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "./color-picker.service";
// Caretaker note: we have still left the `typeof` condition in order to avoid
// creating a breaking change for projects that still use the View Engine.
// The `ngDevMode` is always available when Ivy is enabled.
// This will be evaluated during compilation into `const NG_DEV_MODE = false`,
// thus Terser will be able to tree-shake `console.warn` calls.
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
export class ColorPickerDirective {
    injector;
    cfr;
    appRef;
    vcRef;
    elRef;
    _service;
    dialog;
    dialogCreated = false;
    ignoreChanges = false;
    cmpRef;
    viewAttachedToAppRef = false;
    colorPicker;
    cpWidth = '230px';
    cpHeight = 'auto';
    cpToggle = false;
    cpDisabled = false;
    cpIgnoredElements = [];
    cpFallbackColor = '';
    cpColorMode = 'color';
    cpCmykEnabled = false;
    cpOutputFormat = 'auto';
    cpAlphaChannel = 'enabled';
    cpDisableInput = false;
    cpDialogDisplay = 'popup';
    cpSaveClickOutside = true;
    cpCloseClickOutside = true;
    cpUseRootViewContainer = false;
    cpPosition = 'auto';
    cpPositionOffset = '0%';
    cpPositionRelativeToArrow = false;
    cpOKButton = false;
    cpOKButtonText = 'OK';
    cpOKButtonClass = 'cp-ok-button-class';
    cpCancelButton = false;
    cpCancelButtonText = 'Cancel';
    cpCancelButtonClass = 'cp-cancel-button-class';
    cpEyeDropper = false;
    cpPresetLabel = 'Preset colors';
    cpPresetColors;
    cpPresetColorsClass = 'cp-preset-colors-class';
    cpMaxPresetColorsLength = 6;
    cpPresetEmptyMessage = 'No colors added';
    cpPresetEmptyMessageClass = 'preset-empty-message';
    cpAddColorButton = false;
    cpAddColorButtonText = 'Add color';
    cpAddColorButtonClass = 'cp-add-color-button-class';
    cpRemoveColorButtonClass = 'cp-remove-color-button-class';
    cpArrowPosition = 0;
    cpExtraTemplate;
    cpInputChange = new EventEmitter(true);
    cpToggleChange = new EventEmitter(true);
    cpSliderChange = new EventEmitter(true);
    cpSliderDragEnd = new EventEmitter(true);
    cpSliderDragStart = new EventEmitter(true);
    colorPickerOpen = new EventEmitter(true);
    colorPickerClose = new EventEmitter(true);
    colorPickerCancel = new EventEmitter(true);
    colorPickerSelect = new EventEmitter(true);
    colorPickerChange = new EventEmitter(false);
    cpCmykColorChange = new EventEmitter(true);
    cpPresetColorsChange = new EventEmitter(true);
    handleClick() {
        this.inputFocus();
    }
    handleFocus() {
        this.inputFocus();
    }
    handleInput(event) {
        this.inputChange(event);
    }
    constructor(injector, cfr, appRef, vcRef, elRef, _service) {
        this.injector = injector;
        this.cfr = cfr;
        this.appRef = appRef;
        this.vcRef = vcRef;
        this.elRef = elRef;
        this._service = _service;
    }
    ngOnDestroy() {
        if (this.cmpRef != null) {
            if (this.viewAttachedToAppRef) {
                this.appRef.detachView(this.cmpRef.hostView);
            }
            this.cmpRef.destroy();
            this.cmpRef = null;
            this.dialog = null;
        }
    }
    ngOnChanges(changes) {
        if (changes.cpToggle && !this.cpDisabled) {
            if (changes.cpToggle.currentValue) {
                this.openDialog();
            }
            else if (!changes.cpToggle.currentValue) {
                this.closeDialog();
            }
        }
        if (changes.colorPicker) {
            if (this.dialog && !this.ignoreChanges) {
                if (this.cpDialogDisplay === 'inline') {
                    this.dialog.setInitialColor(changes.colorPicker.currentValue);
                }
                this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
                if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                    this.cmpRef.changeDetectorRef.detectChanges();
                }
            }
            this.ignoreChanges = false;
        }
        if (changes.cpPresetLabel || changes.cpPresetColors) {
            if (this.dialog) {
                this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
            }
        }
    }
    openDialog() {
        if (!this.dialogCreated) {
            let vcRef = this.vcRef;
            this.dialogCreated = true;
            this.viewAttachedToAppRef = false;
            if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                const classOfRootComponent = this.appRef.componentTypes[0];
                const appInstance = this.injector.get(classOfRootComponent, Injector.NULL);
                if (appInstance !== Injector.NULL) {
                    vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef;
                    if (NG_DEV_MODE && vcRef === this.vcRef) {
                        console.warn('You are using cpUseRootViewContainer, ' +
                            'but the root component is not exposing viewContainerRef!' +
                            'Please expose it by adding \'public vcRef: ViewContainerRef\' to the constructor.');
                    }
                }
                else {
                    this.viewAttachedToAppRef = true;
                }
            }
            const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            if (this.viewAttachedToAppRef) {
                this.cmpRef = compFactory.create(this.injector);
                this.appRef.attachView(this.cmpRef.hostView);
                document.body.appendChild(this.cmpRef.hostView.rootNodes[0]);
            }
            else {
                const injector = Injector.create({
                    providers: [],
                    // We shouldn't use `vcRef.parentInjector` since it's been deprecated long time ago and might be removed
                    // in newer Angular versions: https://github.com/angular/angular/pull/25174.
                    parent: vcRef.injector,
                });
                this.cmpRef = vcRef.createComponent(compFactory, 0, injector, []);
            }
            this.cmpRef.instance.setupDialog(this, this.elRef, this.colorPicker, this.cpWidth, this.cpHeight, this.cpDialogDisplay, this.cpFallbackColor, this.cpColorMode, this.cpCmykEnabled, this.cpAlphaChannel, this.cpOutputFormat, this.cpDisableInput, this.cpIgnoredElements, this.cpSaveClickOutside, this.cpCloseClickOutside, this.cpUseRootViewContainer, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpPresetLabel, this.cpPresetColors, this.cpPresetColorsClass, this.cpMaxPresetColorsLength, this.cpPresetEmptyMessage, this.cpPresetEmptyMessageClass, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpAddColorButton, this.cpAddColorButtonClass, this.cpAddColorButtonText, this.cpRemoveColorButtonClass, this.cpEyeDropper, this.elRef, this.cpExtraTemplate);
            this.dialog = this.cmpRef.instance;
            if (this.vcRef !== vcRef) {
                this.cmpRef.changeDetectorRef.detectChanges();
            }
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.colorPicker);
        }
    }
    closeDialog() {
        if (this.dialog && this.cpDialogDisplay === 'popup') {
            this.dialog.closeDialog();
        }
    }
    cmykChanged(value) {
        this.cpCmykColorChange.emit(value);
    }
    stateChanged(state) {
        this.cpToggleChange.emit(state);
        if (state) {
            this.colorPickerOpen.emit(this.colorPicker);
        }
        else {
            this.colorPickerClose.emit(this.colorPicker);
        }
    }
    colorChanged(value, ignore = true) {
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    }
    colorSelected(value) {
        this.colorPickerSelect.emit(value);
    }
    colorCanceled() {
        this.colorPickerCancel.emit();
    }
    inputFocus() {
        const element = this.elRef.nativeElement;
        const ignored = this.cpIgnoredElements.filter((item) => item === element);
        if (!this.cpDisabled && !ignored.length) {
            if (typeof document !== 'undefined' && element === document.activeElement) {
                this.openDialog();
            }
            else if (!this.dialog || !this.dialog.show) {
                this.openDialog();
            }
            else {
                this.closeDialog();
            }
        }
    }
    inputChange(event) {
        if (this.dialog) {
            this.dialog.setColorFromString(event.target.value, true);
        }
        else {
            this.colorPicker = event.target.value;
            this.colorPickerChange.emit(this.colorPicker);
        }
    }
    inputChanged(event) {
        this.cpInputChange.emit(event);
    }
    sliderChanged(event) {
        this.cpSliderChange.emit(event);
    }
    sliderDragEnd(event) {
        this.cpSliderDragEnd.emit(event);
    }
    sliderDragStart(event) {
        this.cpSliderDragStart.emit(event);
    }
    presetColorsChanged(value) {
        this.cpPresetColorsChange.emit(value);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerDirective, deps: [{ token: i0.Injector }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.ColorPickerService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.2", type: ColorPickerDirective, selector: "[colorPicker]", inputs: { colorPicker: "colorPicker", cpWidth: "cpWidth", cpHeight: "cpHeight", cpToggle: "cpToggle", cpDisabled: "cpDisabled", cpIgnoredElements: "cpIgnoredElements", cpFallbackColor: "cpFallbackColor", cpColorMode: "cpColorMode", cpCmykEnabled: "cpCmykEnabled", cpOutputFormat: "cpOutputFormat", cpAlphaChannel: "cpAlphaChannel", cpDisableInput: "cpDisableInput", cpDialogDisplay: "cpDialogDisplay", cpSaveClickOutside: "cpSaveClickOutside", cpCloseClickOutside: "cpCloseClickOutside", cpUseRootViewContainer: "cpUseRootViewContainer", cpPosition: "cpPosition", cpPositionOffset: "cpPositionOffset", cpPositionRelativeToArrow: "cpPositionRelativeToArrow", cpOKButton: "cpOKButton", cpOKButtonText: "cpOKButtonText", cpOKButtonClass: "cpOKButtonClass", cpCancelButton: "cpCancelButton", cpCancelButtonText: "cpCancelButtonText", cpCancelButtonClass: "cpCancelButtonClass", cpEyeDropper: "cpEyeDropper", cpPresetLabel: "cpPresetLabel", cpPresetColors: "cpPresetColors", cpPresetColorsClass: "cpPresetColorsClass", cpMaxPresetColorsLength: "cpMaxPresetColorsLength", cpPresetEmptyMessage: "cpPresetEmptyMessage", cpPresetEmptyMessageClass: "cpPresetEmptyMessageClass", cpAddColorButton: "cpAddColorButton", cpAddColorButtonText: "cpAddColorButtonText", cpAddColorButtonClass: "cpAddColorButtonClass", cpRemoveColorButtonClass: "cpRemoveColorButtonClass", cpArrowPosition: "cpArrowPosition", cpExtraTemplate: "cpExtraTemplate" }, outputs: { cpInputChange: "cpInputChange", cpToggleChange: "cpToggleChange", cpSliderChange: "cpSliderChange", cpSliderDragEnd: "cpSliderDragEnd", cpSliderDragStart: "cpSliderDragStart", colorPickerOpen: "colorPickerOpen", colorPickerClose: "colorPickerClose", colorPickerCancel: "colorPickerCancel", colorPickerSelect: "colorPickerSelect", colorPickerChange: "colorPickerChange", cpCmykColorChange: "cpCmykColorChange", cpPresetColorsChange: "cpPresetColorsChange" }, host: { listeners: { "click": "handleClick()", "focus": "handleFocus()", "input": "handleInput($event)" } }, exportAs: ["ngxColorPicker"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ColorPickerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[colorPicker]',
                    exportAs: 'ngxColorPicker'
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.ColorPickerService }], propDecorators: { colorPicker: [{
                type: Input
            }], cpWidth: [{
                type: Input
            }], cpHeight: [{
                type: Input
            }], cpToggle: [{
                type: Input
            }], cpDisabled: [{
                type: Input
            }], cpIgnoredElements: [{
                type: Input
            }], cpFallbackColor: [{
                type: Input
            }], cpColorMode: [{
                type: Input
            }], cpCmykEnabled: [{
                type: Input
            }], cpOutputFormat: [{
                type: Input
            }], cpAlphaChannel: [{
                type: Input
            }], cpDisableInput: [{
                type: Input
            }], cpDialogDisplay: [{
                type: Input
            }], cpSaveClickOutside: [{
                type: Input
            }], cpCloseClickOutside: [{
                type: Input
            }], cpUseRootViewContainer: [{
                type: Input
            }], cpPosition: [{
                type: Input
            }], cpPositionOffset: [{
                type: Input
            }], cpPositionRelativeToArrow: [{
                type: Input
            }], cpOKButton: [{
                type: Input
            }], cpOKButtonText: [{
                type: Input
            }], cpOKButtonClass: [{
                type: Input
            }], cpCancelButton: [{
                type: Input
            }], cpCancelButtonText: [{
                type: Input
            }], cpCancelButtonClass: [{
                type: Input
            }], cpEyeDropper: [{
                type: Input
            }], cpPresetLabel: [{
                type: Input
            }], cpPresetColors: [{
                type: Input
            }], cpPresetColorsClass: [{
                type: Input
            }], cpMaxPresetColorsLength: [{
                type: Input
            }], cpPresetEmptyMessage: [{
                type: Input
            }], cpPresetEmptyMessageClass: [{
                type: Input
            }], cpAddColorButton: [{
                type: Input
            }], cpAddColorButtonText: [{
                type: Input
            }], cpAddColorButtonClass: [{
                type: Input
            }], cpRemoveColorButtonClass: [{
                type: Input
            }], cpArrowPosition: [{
                type: Input
            }], cpExtraTemplate: [{
                type: Input
            }], cpInputChange: [{
                type: Output
            }], cpToggleChange: [{
                type: Output
            }], cpSliderChange: [{
                type: Output
            }], cpSliderDragEnd: [{
                type: Output
            }], cpSliderDragStart: [{
                type: Output
            }], colorPickerOpen: [{
                type: Output
            }], colorPickerClose: [{
                type: Output
            }], colorPickerCancel: [{
                type: Output
            }], colorPickerSelect: [{
                type: Output
            }], colorPickerChange: [{
                type: Output
            }], cpCmykColorChange: [{
                type: Output
            }], cpPresetColorsChange: [{
                type: Output
            }], handleClick: [{
                type: HostListener,
                args: ['click']
            }], handleFocus: [{
                type: HostListener,
                args: ['focus']
            }], handleInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBd0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQ25FLFlBQVksRUFDWixRQUFRLEVBQTBELE1BQU0sZUFBZSxDQUFDO0FBRzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7QUFJaEUsOEVBQThFO0FBQzlFLDBFQUEwRTtBQUMxRSwyREFBMkQ7QUFDM0QsOEVBQThFO0FBQzlFLCtEQUErRDtBQUMvRCxNQUFNLFdBQVcsR0FBRyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQU1wRSxNQUFNLE9BQU8sb0JBQW9CO0lBbUdYO0lBQTRCO0lBQ3RDO0lBQWdDO0lBQWlDO0lBQ2pFO0lBcEdGLE1BQU0sQ0FBTTtJQUVaLGFBQWEsR0FBWSxLQUFLLENBQUM7SUFDL0IsYUFBYSxHQUFZLEtBQUssQ0FBQztJQUUvQixNQUFNLENBQXFDO0lBQzNDLG9CQUFvQixHQUFZLEtBQUssQ0FBQztJQUVyQyxXQUFXLENBQVM7SUFFcEIsT0FBTyxHQUFXLE9BQU8sQ0FBQztJQUMxQixRQUFRLEdBQVcsTUFBTSxDQUFDO0lBRTFCLFFBQVEsR0FBWSxLQUFLLENBQUM7SUFDMUIsVUFBVSxHQUFZLEtBQUssQ0FBQztJQUU1QixpQkFBaUIsR0FBUSxFQUFFLENBQUM7SUFFNUIsZUFBZSxHQUFXLEVBQUUsQ0FBQztJQUU3QixXQUFXLEdBQWMsT0FBTyxDQUFDO0lBRWpDLGFBQWEsR0FBWSxLQUFLLENBQUM7SUFFL0IsY0FBYyxHQUFpQixNQUFNLENBQUM7SUFDdEMsY0FBYyxHQUFpQixTQUFTLENBQUM7SUFFekMsY0FBYyxHQUFZLEtB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SztnQkFDRyxvQkFBb0I7c0JBQTVCLEtBQUs7Z0JBQ0cscUJBQXFCO3NCQUE3QixLQUFLO2dCQUVHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUksYUFBYTtzQkFBdEIsTUFBTTtnQkFFRyxjQUFjO3NCQUF2QixNQUFNO2dCQUVHLGNBQWM7c0JBQXZCLE1BQU07Z0JBQ0csZUFBZTtzQkFBeEIsTUFBTTtnQkFDRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBRUcsZUFBZTtzQkFBeEIsTUFBTTtnQkFDRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBRUcsaUJBQWlCO3NCQUExQixNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBRUcsaUJBQWlCO3NCQUExQixNQUFNO2dCQUVHLG9CQUFvQjtzQkFBN0IsTUFBTTtnQkFFZ0IsV0FBVztzQkFBakMsWUFBWTt1QkFBQyxPQUFPO2dCQUlFLFdBQVc7c0JBQWpDLFlBQVk7dUJBQUMsT0FBTztnQkFJYyxXQUFXO3NCQUE3QyxZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLCBBcHBsaWNhdGlvblJlZiwgQ29tcG9uZW50UmVmLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmLFxuICBJbmplY3RvciwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBFbWJlZGRlZFZpZXdSZWYsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvbG9yUGlja2VyU2VydmljZSB9IGZyb20gJy4vY29sb3ItcGlja2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29sb3JQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbG9yLXBpY2tlci5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBBbHBoYUNoYW5uZWwsIENvbG9yTW9kZSwgT3V0cHV0Rm9ybWF0IH0gZnJvbSAnLi9oZWxwZXJzJztcblxuLy8gQ2FyZXRha2VyIG5vdGU6IHdlIGhhdmUgc3RpbGwgbGVmdCB0aGUgYHR5cGVvZmAgY29uZGl0aW9uIGluIG9yZGVyIHRvIGF2b2lkXG4vLyBjcmVhdGluZyBhIGJyZWFraW5nIGNoYW5nZSBmb3IgcHJvamVjdHMgdGhhdCBzdGlsbCB1c2UgdGhlIFZpZXcgRW5naW5lLlxuLy8gVGhlIGBuZ0Rldk1vZGVgIGlzIGFsd2F5cyBhdmFpbGFibGUgd2hlbiBJdnkgaXMgZW5hYmxlZC5cbi8vIFRoaXMgd2lsbCBiZSBldmFsdWF0ZWQgZHVyaW5nIGNvbXBpbGF0aW9uIGludG8gYGNvbnN0IE5HX0RFVl9NT0RFID0gZmFsc2VgLFxuLy8gdGh1cyBUZXJzZXIgd2lsbCBiZSBhYmxlIHRvIHRyZWUtc2hha2UgYGNvbnNvbGUud2FybmAgY2FsbHMuXG5jb25zdCBOR19ERVZfTU9ERSA9IHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8ICEhbmdEZXZNb2RlO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY29sb3JQaWNrZXJdJyxcbiAgZXhwb3J0QXM6ICduZ3hDb2xvclBpY2tlcidcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZGlhbG9nOiBhbnk7XG5cbiAgcHJpdmF0ZSBkaWFsb2dDcmVhdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgaWdub3JlQ2hhbmdlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY21wUmVmOiBDb21wb25lbnRSZWY8Q29sb3JQaWNrZXJDb21wb25lbnQ+O1xuICBwcml2YXRlIHZpZXdBdHRhY2hlZFRvQXBwUmVmOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY29sb3JQaWNrZXI6IHN0cmluZztcblxuICBASW5wdXQoKSBjcFdpZHRoOiBzdHJpbmcgPSAnMjMwcHgnO1xuICBASW5wdXQoKSBjcEhlaWdodDogc3RyaW5nID0gJ2F1dG8nO1xuXG4gIEBJbnB1dCgpIGNwVG9nZ2xlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGNwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKSBjcElnbm9yZWRFbGVtZW50czogYW55ID0gW107XG5cbiAgQElucHV0KCkgY3BGYWxsYmFja0NvbG9yOiBzdHJpbmcgPSAnJztcblxuICBASW5wdXQoKSBjcENvbG9yTW9kZTogQ29sb3JNb2RlID0gJ2NvbG9yJztcblxuICBASW5wdXQoKSBjcENteWtFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY3BPdXRwdXRGb3JtYXQ6IE91dHB1dEZvcm1hdCA9ICdhdXRvJztcbiAgQElucHV0KCkgY3BBbHBoYUNoYW5uZWw6IEFscGhhQ2hhbm5lbCA9ICdlbmFibGVkJztcblxuICBASW5wdXQoKSBjcERpc2FibGVJbnB1dDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGNwRGlhbG9nRGlzcGxheTogc3RyaW5nID0gJ3BvcHVwJztcblxuICBASW5wdXQoKSBjcFNhdmVDbGlja091dHNpZGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBjcENsb3NlQ2xpY2tPdXRzaWRlOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKSBjcFVzZVJvb3RWaWV3Q29udGFpbmVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY3BQb3NpdGlvbjogc3RyaW5nID0gJ2F1dG8nO1xuICBASW5wdXQoKSBjcFBvc2l0aW9uT2Zmc2V0OiBzdHJpbmcgPSAnMCUnO1xuICBASW5wdXQoKSBjcFBvc2l0aW9uUmVsYXRpdmVUb0Fycm93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY3BPS0J1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBjcE9LQnV0dG9uVGV4dDogc3RyaW5nID0gJ09LJztcbiAgQElucHV0KCkgY3BPS0J1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3Atb2stYnV0dG9uLWNsYXNzJztcblxuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvblRleHQ6IHN0cmluZyA9ICdDYW5jZWwnO1xuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3AtY2FuY2VsLWJ1dHRvbi1jbGFzcyc7XG5cbiAgQElucHV0KCkgY3BFeWVEcm9wcGVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgY3BQcmVzZXRMYWJlbDogc3RyaW5nID0gJ1ByZXNldCBjb2xvcnMnO1xuICBASW5wdXQoKSBjcFByZXNldENvbG9yczogc3RyaW5nW107XG4gIEBJbnB1dCgpIGNwUHJlc2V0Q29sb3JzQ2xhc3M6IHN0cmluZyA9ICdjcC1wcmVzZXQtY29sb3JzLWNsYXNzJztcbiAgQElucHV0KCkgY3BNYXhQcmVzZXRDb2xvcnNMZW5ndGg6IG51bWJlciA9IDY7XG5cbiAgQElucHV0KCkgY3BQcmVzZXRFbXB0eU1lc3NhZ2U6IHN0cmluZyA9ICdObyBjb2xvcnMgYWRkZWQnO1xuICBASW5wdXQoKSBjcFByZXNldEVtcHR5TWVzc2FnZUNsYXNzOiBzdHJpbmcgPSAncHJlc2V0LWVtcHR5LW1lc3NhZ2UnO1xuXG4gIEBJbnB1dCgpIGNwQWRkQ29sb3JCdXR0b246IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgY3BBZGRDb2xvckJ1dHRvblRleHQ6IHN0cmluZyA9ICdBZGQgY29sb3InO1xuICBASW5wdXQoKSBjcEFkZENvbG9yQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1hZGQtY29sb3ItYnV0dG9uLWNsYXNzJztcblxuICBASW5wdXQoKSBjcFJlbW92ZUNvbG9yQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1yZW1vdmUtY29sb3ItYnV0dG9uLWNsYXNzJztcbiAgQElucHV0KCkgY3BBcnJvd1Bvc2l0aW9uOiBudW1iZXIgPSAwO1xuXG4gIEBJbnB1dCgpIGNwRXh0cmFUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KCkgY3BJbnB1dENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8e2lucHV0OiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsIGNvbG9yOiBzdHJpbmd9Pih0cnVlKTtcblxuICBAT3V0cHV0KCkgY3BUb2dnbGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KHRydWUpO1xuXG4gIEBPdXRwdXQoKSBjcFNsaWRlckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8e3NsaWRlcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBjb2xvcjogc3RyaW5nfT4odHJ1ZSk7XG4gIEBPdXRwdXQoKSBjcFNsaWRlckRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPHtzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZ30+KHRydWUpO1xuICBAT3V0cHV0KCkgY3BTbGlkZXJEcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPHtzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZ30+KHRydWUpO1xuXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlck9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlckNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xuXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlckNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oZmFsc2UpO1xuXG4gIEBPdXRwdXQoKSBjcENteWtDb2xvckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcblxuICBAT3V0cHV0KCkgY3BQcmVzZXRDb2xvcnNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4odHJ1ZSk7XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKSBoYW5kbGVDbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0Rm9jdXMoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJykgaGFuZGxlRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dEZvY3VzKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pIGhhbmRsZUlucHV0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0Q2hhbmdlKGV2ZW50KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGNmcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZiwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBDb2xvclBpY2tlclNlcnZpY2UpIHt9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY21wUmVmICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmKSB7XG4gICAgICAgIHRoaXMuYXBwUmVmLmRldGFjaFZpZXcodGhpcy5jbXBSZWYuaG9zdFZpZXcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNtcFJlZi5kZXN0cm95KCk7XG5cbiAgICAgIHRoaXMuY21wUmVmID0gbnVsbDtcbiAgICAgIHRoaXMuZGlhbG9nID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5jcFRvZ2dsZSAmJiAhdGhpcy5jcERpc2FibGVkKSB7XG4gICAgICBpZiAoY2hhbmdlcy5jcFRvZ2dsZS5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9nKCk7XG4gICAgICB9IGVsc2UgaWYgKCFjaGFuZ2VzLmNwVG9nZ2xlLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuY29sb3JQaWNrZXIpIHtcbiAgICAgIGlmICh0aGlzLmRpYWxvZyAmJiAhdGhpcy5pZ25vcmVDaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLmNwRGlhbG9nRGlzcGxheSA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5zZXRJbml0aWFsQ29sb3IoY2hhbmdlcy5jb2xvclBpY2tlci5jdXJyZW50VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaWFsb2cuc2V0Q29sb3JGcm9tU3RyaW5nKGNoYW5nZXMuY29sb3JQaWNrZXIuY3VycmVudFZhbHVlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3BVc2VSb290Vmlld0NvbnRhaW5lciAmJiB0aGlzLmNwRGlhbG9nRGlzcGxheSAhPT0gJ2lubGluZScpIHtcbiAgICAgICAgICB0aGlzLmNtcFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5pZ25vcmVDaGFuZ2VzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuY3BQcmVzZXRMYWJlbCB8fCBjaGFuZ2VzLmNwUHJlc2V0Q29sb3JzKSB7XG4gICAgICBpZiAodGhpcy5kaWFsb2cpIHtcbiAgICAgICAgdGhpcy5kaWFsb2cuc2V0UHJlc2V0Q29uZmlnKHRoaXMuY3BQcmVzZXRMYWJlbCwgdGhpcy5jcFByZXNldENvbG9ycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9wZW5EaWFsb2coKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpYWxvZ0NyZWF0ZWQpIHtcbiAgICAgIGxldCB2Y1JlZiA9IHRoaXMudmNSZWY7XG5cbiAgICAgIHRoaXMuZGlhbG9nQ3JlYXRlZCA9IHRydWU7XG4gICAgICB0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLmNwVXNlUm9vdFZpZXdDb250YWluZXIgJiYgdGhpcy5jcERpYWxvZ0Rpc3BsYXkgIT09ICdpbmxpbmUnKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzT2ZSb290Q29tcG9uZW50ID0gdGhpcy5hcHBSZWYuY29tcG9uZW50VHlwZXNbMF07XG4gICAgICAgIGNvbnN0IGFwcEluc3RhbmNlID0gdGhpcy5pbmplY3Rvci5nZXQoY2xhc3NPZlJvb3RDb21wb25lbnQsIEluamVjdG9yLk5VTEwpO1xuXG4gICAgICAgIGlmIChhcHBJbnN0YW5jZSAhPT0gSW5qZWN0b3IuTlVMTCkge1xuICAgICAgICAgIHZjUmVmID0gYXBwSW5zdGFuY2UudmNSZWYgfHwgYXBwSW5zdGFuY2Uudmlld0NvbnRhaW5lclJlZiB8fCB0aGlzLnZjUmVmO1xuXG4gICAgICAgICAgaWYgKE5HX0RFVl9NT0RFICYmIHZjUmVmID09PSB0aGlzLnZjUmVmKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgdXNpbmcgY3BVc2VSb290Vmlld0NvbnRhaW5lciwgJyArXG4gICAgICAgICAgICAgICdidXQgdGhlIHJvb3QgY29tcG9uZW50IGlzIG5vdCBleHBvc2luZyB2aWV3Q29udGFpbmVyUmVmIScgK1xuICAgICAgICAgICAgICAnUGxlYXNlIGV4cG9zZSBpdCBieSBhZGRpbmcgXFwncHVibGljIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmXFwnIHRvIHRoZSBjb25zdHJ1Y3Rvci4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWV3QXR0YWNoZWRUb0FwcFJlZiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcEZhY3RvcnkgPSB0aGlzLmNmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShDb2xvclBpY2tlckNvbXBvbmVudCk7XG5cbiAgICAgIGlmICh0aGlzLnZpZXdBdHRhY2hlZFRvQXBwUmVmKSB7XG4gICAgICAgIHRoaXMuY21wUmVmID0gY29tcEZhY3RvcnkuY3JlYXRlKHRoaXMuaW5qZWN0b3IpO1xuICAgICAgICB0aGlzLmFwcFJlZi5hdHRhY2hWaWV3KHRoaXMuY21wUmVmLmhvc3RWaWV3KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgodGhpcy5jbXBSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgICAgICAvLyBXZSBzaG91bGRuJ3QgdXNlIGB2Y1JlZi5wYXJlbnRJbmplY3RvcmAgc2luY2UgaXQncyBiZWVuIGRlcHJlY2F0ZWQgbG9uZyB0aW1lIGFnbyBhbmQgbWlnaHQgYmUgcmVtb3ZlZFxuICAgICAgICAgIC8vIGluIG5ld2VyIEFuZ3VsYXIgdmVyc2lvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8yNTE3NC5cbiAgICAgICAgICBwYXJlbnQ6IHZjUmVmLmluamVjdG9yLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNtcFJlZiA9IHZjUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wRmFjdG9yeSwgMCwgaW5qZWN0b3IsIFtdKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbXBSZWYuaW5zdGFuY2Uuc2V0dXBEaWFsb2codGhpcywgdGhpcy5lbFJlZiwgdGhpcy5jb2xvclBpY2tlcixcbiAgICAgICAgdGhpcy5jcFdpZHRoLCB0aGlzLmNwSGVpZ2h0LCB0aGlzLmNwRGlhbG9nRGlzcGxheSwgdGhpcy5jcEZhbGxiYWNrQ29sb3IsIHRoaXMuY3BDb2xvck1vZGUsXG4gICAgICAgIHRoaXMuY3BDbXlrRW5hYmxlZCwgdGhpcy5jcEFscGhhQ2hhbm5lbCwgdGhpcy5jcE91dHB1dEZvcm1hdCwgdGhpcy5jcERpc2FibGVJbnB1dCxcbiAgICAgICAgdGhpcy5jcElnbm9yZWRFbGVtZW50cywgdGhpcy5jcFNhdmVDbGlja091dHNpZGUsIHRoaXMuY3BDbG9zZUNsaWNrT3V0c2lkZSxcbiAgICAgICAgdGhpcy5jcFVzZVJvb3RWaWV3Q29udGFpbmVyLCB0aGlzLmNwUG9zaXRpb24sIHRoaXMuY3BQb3NpdGlvbk9mZnNldCxcbiAgICAgICAgdGhpcy5jcFBvc2l0aW9uUmVsYXRpdmVUb0Fycm93LCB0aGlzLmNwUHJlc2V0TGFiZWwsIHRoaXMuY3BQcmVzZXRDb2xvcnMsXG4gICAgICAgIHRoaXMuY3BQcmVzZXRDb2xvcnNDbGFzcywgdGhpcy5jcE1heFByZXNldENvbG9yc0xlbmd0aCwgdGhpcy5jcFByZXNldEVtcHR5TWVzc2FnZSxcbiAgICAgICAgdGhpcy5jcFByZXNldEVtcHR5TWVzc2FnZUNsYXNzLCB0aGlzLmNwT0tCdXR0b24sIHRoaXMuY3BPS0J1dHRvbkNsYXNzLFxuICAgICAgICB0aGlzLmNwT0tCdXR0b25UZXh0LCB0aGlzLmNwQ2FuY2VsQnV0dG9uLCB0aGlzLmNwQ2FuY2VsQnV0dG9uQ2xhc3MsXG4gICAgICAgIHRoaXMuY3BDYW5jZWxCdXR0b25UZXh0LCB0aGlzLmNwQWRkQ29sb3JCdXR0b24sIHRoaXMuY3BBZGRDb2xvckJ1dHRvbkNsYXNzLFxuICAgICAgICB0aGlzLmNwQWRkQ29sb3JCdXR0b25UZXh0LCB0aGlzLmNwUmVtb3ZlQ29sb3JCdXR0b25DbGFzcywgdGhpcy5jcEV5ZURyb3BwZXIsIHRoaXMuZWxSZWYsXG4gICAgICAgIHRoaXMuY3BFeHRyYVRlbXBsYXRlKTtcblxuICAgICAgdGhpcy5kaWFsb2cgPSB0aGlzLmNtcFJlZi5pbnN0YW5jZTtcblxuICAgICAgaWYgKHRoaXMudmNSZWYgIT09IHZjUmVmKSB7XG4gICAgICAgIHRoaXMuY21wUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZGlhbG9nKSB7XG4gICAgICB0aGlzLmRpYWxvZy5vcGVuRGlhbG9nKHRoaXMuY29sb3JQaWNrZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjbG9zZURpYWxvZygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaWFsb2cgJiYgdGhpcy5jcERpYWxvZ0Rpc3BsYXkgPT09ICdwb3B1cCcpIHtcbiAgICAgIHRoaXMuZGlhbG9nLmNsb3NlRGlhbG9nKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNteWtDaGFuZ2VkKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNwQ215a0NvbG9yQ2hhbmdlLmVtaXQodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHN0YXRlQ2hhbmdlZChzdGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY3BUb2dnbGVDaGFuZ2UuZW1pdChzdGF0ZSk7XG5cbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHRoaXMuY29sb3JQaWNrZXJPcGVuLmVtaXQodGhpcy5jb2xvclBpY2tlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sb3JQaWNrZXJDbG9zZS5lbWl0KHRoaXMuY29sb3JQaWNrZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjb2xvckNoYW5nZWQodmFsdWU6IHN0cmluZywgaWdub3JlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuaWdub3JlQ2hhbmdlcyA9IGlnbm9yZTtcblxuICAgIHRoaXMuY29sb3JQaWNrZXJDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgY29sb3JTZWxlY3RlZCh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb2xvclBpY2tlclNlbGVjdC5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBjb2xvckNhbmNlbGVkKCk6IHZvaWQge1xuICAgIHRoaXMuY29sb3JQaWNrZXJDYW5jZWwuZW1pdCgpO1xuICB9XG5cbiAgcHVibGljIGlucHV0Rm9jdXMoKTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNvbnN0IGlnbm9yZWQgPSB0aGlzLmNwSWdub3JlZEVsZW1lbnRzLmZpbHRlcigoaXRlbTogYW55KSA9PiBpdGVtID09PSBlbGVtZW50KTtcblxuICAgIGlmICghdGhpcy5jcERpc2FibGVkICYmICFpZ25vcmVkLmxlbmd0aCkge1xuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICB0aGlzLm9wZW5EaWFsb2coKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZGlhbG9nIHx8ICF0aGlzLmRpYWxvZy5zaG93KSB7XG4gICAgICAgIHRoaXMub3BlbkRpYWxvZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnB1dENoYW5nZShldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlhbG9nKSB7XG4gICAgICB0aGlzLmRpYWxvZy5zZXRDb2xvckZyb21TdHJpbmcoZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xvclBpY2tlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgICAgdGhpcy5jb2xvclBpY2tlckNoYW5nZS5lbWl0KHRoaXMuY29sb3JQaWNrZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnB1dENoYW5nZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY3BJbnB1dENoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzbGlkZXJDaGFuZ2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNwU2xpZGVyQ2hhbmdlLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHVibGljIHNsaWRlckRyYWdFbmQoZXZlbnQ6IHsgc2xpZGVyOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIHRoaXMuY3BTbGlkZXJEcmFnRW5kLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHVibGljIHNsaWRlckRyYWdTdGFydChldmVudDogeyBzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZyB9KTogdm9pZCB7XG4gICAgdGhpcy5jcFNsaWRlckRyYWdTdGFydC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBwcmVzZXRDb2xvcnNDaGFuZ2VkKHZhbHVlOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMuY3BQcmVzZXRDb2xvcnNDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==