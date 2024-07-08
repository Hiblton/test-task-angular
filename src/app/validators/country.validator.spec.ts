import { FormControl } from '@angular/forms';
import { countryValidator } from './country.validator';
import { Country } from '../shared/enum/country';

describe('countryValidator', () => {
    it('should return null if control value is an empty string', () => {
        const control = new FormControl('');
        const result = countryValidator()(control);
        expect(result).toBeNull();
    });

    it('should return null for a valid country', () => {
        const control = new FormControl(Country.USA);
        const result = countryValidator()(control);
        expect(result).toBeNull();
    });

    it('should return { invalidCountry: true } for an invalid country', () => {
        const control = new FormControl('InvalidCountry');
        const result = countryValidator()(control);
        expect(result).toEqual({ invalidCountry: true });
    });
});
