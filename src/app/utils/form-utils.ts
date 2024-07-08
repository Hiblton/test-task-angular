import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

export function triggerValidation(control: AbstractControl): void {
    control.markAllAsTouched();
    control.updateValueAndValidity({ onlySelf: true });

    if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(triggerValidation);
    } else if (control instanceof FormArray) {
        control.controls.forEach(triggerValidation);
    }
}
