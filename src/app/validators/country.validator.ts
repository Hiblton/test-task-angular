import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Country } from '../shared/enum/country';

export function countryValidator(): ValidatorFn {
    const countries = Object.values(Country);

    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        return countries.includes(control.value) ? null : { invalidCountry: true };
    };
}
