import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormCardComponent } from './form-card.component';
import { Country } from '../../shared/enum/country';
import { By } from '@angular/platform-browser';

describe('FormCardComponent', () => {
    let component: FormCardComponent;
    let fixture: ComponentFixture<FormCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormCardComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormCardComponent);
        component = fixture.componentInstance;
        component.formGroup = new FormGroup({
            country: new FormControl(''),
            username: new FormControl(''),
            birthday: new FormControl('')
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize countries array from Country enum', () => {
        expect(component.countries).toEqual(Object.values(Country));
    });

    it('should display error message for invalid country', () => {
        const countryControl = component.formGroup.get('country');
        countryControl?.setValue('InvalidCountry');
        countryControl?.setErrors({ invalidCountry: true });
        countryControl?.markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('.text-danger')).nativeElement.textContent.trim();
        expect(errorMessage).toBe('Please provide a correct Country');
    });

    it('should display error message for unavailable username', () => {
        const usernameControl = component.formGroup.get('username');
        usernameControl?.setValue('existingUsername');
        usernameControl?.setErrors({ unavailable: true });
        usernameControl?.markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('.text-danger')).nativeElement.textContent.trim();
        expect(errorMessage).toBe('This username is not available');
    });

    it('should display error message for duplicate username', () => {
        const usernameControl = component.formGroup.get('username');
        usernameControl?.setValue('duplicateUsername');
        usernameControl?.setErrors({ duplicate: true });
        usernameControl?.markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('.text-danger')).nativeElement.textContent.trim();
        expect(errorMessage).toBe('This username is already used in another form');
    });

    it('should display error message for invalid birthday', () => {
        const birthdayControl = component.formGroup.get('birthday');
        birthdayControl?.setValue('2050-01-01');
        birthdayControl?.setErrors({ invalidBirthday: true });
        birthdayControl?.markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('.text-danger')).nativeElement.textContent.trim();
        expect(errorMessage).toBe('Birthdays cannot be later than the current date');
    });
});
