import { FormControl } from '@angular/forms';
import { birthdayValidator } from './birthday.validator';

describe('birthdayValidator', () => {
    it('should return null if control value is an empty string', () => {
        const control = new FormControl('');
        const result = birthdayValidator()(control);
        expect(result).toBeNull();
    });

    it('should return null for a valid birthday (today)', () => {
        const today = new Date().toISOString().split('T')[0];
        const control = new FormControl(today);
        const result = birthdayValidator()(control);
        expect(result).toBeNull();
    });

    it('should return null for a valid past birthday', () => {
        const pastDate = new Date(2000, 0, 1).toISOString().split('T')[0];
        const control = new FormControl(pastDate);
        const result = birthdayValidator()(control);
        expect(result).toBeNull();
    });

    it('should return { invalidBirthday: true } for a future birthday', () => {
        const futureDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
        const control = new FormControl(futureDate);
        const result = birthdayValidator()(control);
        expect(result).toEqual({ invalidBirthday: true });
    });
});
