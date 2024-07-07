import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const selectedDate = new Date(control.value);
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            return { invalidBirthday: true };
        }

        return null;
    };
}
