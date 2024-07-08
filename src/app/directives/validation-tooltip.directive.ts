import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appValidationTooltip]'
})
export class ValidationTooltipDirective implements OnInit, OnDestroy {
    @Input() control!: AbstractControl;
    @Input() placeholder!: string;

    @HostListener('mouseenter')
    onMouseEnter() {
        if (this.validationMessageElement) {
            this.renderer.setStyle(this.validationMessageElement, 'opacity', '1');
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.validationMessageElement) {
            this.renderer.setStyle(this.validationMessageElement, 'opacity', '0');
        }
    }

    private validationMessageElement: HTMLDivElement | null = null;
    private destroy$ = new Subject<void>();

    constructor(private el: ElementRef, private renderer: Renderer2, private ngControl: NgControl) { }

    ngOnInit() {
        if (this.ngControl && this.ngControl.control) {
            this.control = this.ngControl.control;
        }

        this.control.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateValidationMessage();
            });

        this.updateValidationMessage();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateValidationMessage() {
        if (this.validationMessageElement) {
            this.renderer.removeChild(this.el.nativeElement.parentNode, this.validationMessageElement);
            this.validationMessageElement = null;
        }

        if (this.control.errors) {
            const validationMessage = this.getValidationMessage();
            if (validationMessage) {
                this.createValidationTooltip(validationMessage);
                this.renderer.addClass(this.el.nativeElement, 'is-invalid');
            }
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
        }
    }

    private getValidationMessage(): string | null {
        if (this.control.untouched && this.control.pristine || this.control.valid) return null;

        if (this.control.hasError('required')) {
            return `Please provide a correct ${this.placeholder || 'value'}.`;
        } else if (this.control.hasError('invalidCountry')) {
            return 'Please provide a correct Country.';
        } else if (this.control.hasError('unavailable')) {
            return 'This username is not available.';
        } else if (this.control.hasError('duplicate')) {
            return 'This username is already used in another form.';
        } else if (this.control.hasError('invalidBirthday')) {
            return 'Birthdays cannot be later than the current date.';
        }

        return null;
    }

    private createValidationTooltip(message: string) {
        this.validationMessageElement = this.renderer.createElement('div');
        this.renderer.setAttribute(this.validationMessageElement, 'class', 'tooltip bs-tooltip-bottom');
        this.renderer.setStyle(this.validationMessageElement, 'top', 'calc(100% + 5px)');
        this.renderer.setStyle(this.validationMessageElement, 'left', '50%');
        this.renderer.setStyle(this.validationMessageElement, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(this.validationMessageElement, 'white-space', 'nowrap');
        this.renderer.setStyle(this.validationMessageElement, 'backgroundColor', '#dc3545');
        this.renderer.setStyle(this.validationMessageElement, 'color', '#ffffff');
        this.renderer.setStyle(this.validationMessageElement, 'padding', '5px 10px');
        this.renderer.setStyle(this.validationMessageElement, 'borderRadius', '4px');

        const arrow = this.renderer.createElement('div');
        this.renderer.setAttribute(arrow, 'class', 'arrow');
        this.renderer.setStyle(arrow, 'top', '-5px');
        this.renderer.setStyle(arrow, 'left', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateX(-50%)');

        this.renderer.appendChild(this.validationMessageElement, arrow);
        this.renderer.appendChild(this.validationMessageElement, this.renderer.createText(message));
        this.renderer.appendChild(this.el.nativeElement.parentNode, this.validationMessageElement);
    }
}
