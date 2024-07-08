import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormPageComponent, COUNTDOWN_DURATION } from './form-page.component';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormArray } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { countryValidator } from '../../validators/country.validator';
import { birthdayValidator } from '../../validators/birthday.validator';
import { usernameAsyncValidator } from '../../validators/username.validator';
import { Country } from '../../shared/enum/country';

describe('FormPageComponent', () => {
    let component: FormPageComponent;
    let fixture: ComponentFixture<FormPageComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(async () => {
        const apiService = jasmine.createSpyObj('ApiService', ['submitForm', 'checkUser']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [FormPageComponent],
            providers: [
                FormBuilder,
                { provide: ApiService, useValue: apiService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(FormPageComponent);
        component = fixture.componentInstance;
        apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    });

    function createValidFormGroup(): FormGroup {
        const formBuilder = TestBed.inject(FormBuilder);
        const formGroup = new FormGroup({
            country: formBuilder.control(Country.Ukraine, [Validators.required, countryValidator()]),
            username: formBuilder.control('newUser', [Validators.required], [usernameAsyncValidator(apiServiceSpy, component.formArray)]),
            birthday: formBuilder.control('2000-01-01', [Validators.required, birthdayValidator()]),
        });

        return formGroup;
    }

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with one form', () => {
        fixture.detectChanges();
        expect(component.formArray.length).toBe(1);
    });

    it('should add a form', () => {
        fixture.detectChanges();
        component.addForm();
        expect(component.formArray.length).toBe(2);
    });

    it('should not add more than 10 forms', () => {
        for (let i = 0; i < 10; i++) {
            component.addForm();
        }
        component.addForm();
        expect(component.formArray.length).toBe(10);
    });

    it('should call finalSubmit with form data on timer end', fakeAsync(() => {
        apiServiceSpy.checkUser.and.returnValue(of({ isAvailable: true }));
        spyOn(component, 'finalSubmit');
        component.formArray = new FormArray([createValidFormGroup()]);
        component.submitAll();

        tick(1000 * COUNTDOWN_DURATION);
        tick(1000); // Extra tick to call finalSubmit
        expect(component.formArray.disabled).toBeTrue();
        expect(component.finalSubmit).toHaveBeenCalledWith(component.formArray.value);
    }));

    it('should cancel the timer and enable forms on cancelSubmit', fakeAsync(() => {
        apiServiceSpy.checkUser.and.returnValue(of({ isAvailable: true }));
        spyOn(component, 'finalSubmit');
        component.formArray = new FormArray([createValidFormGroup()]);
        component.submitAll();
        tick(2000);

        component.cancelSubmit();

        expect(component.formArray.enabled).toBeTrue();
        expect(component.finalSubmit).not.toHaveBeenCalled();
    }));

    it('should handle finalSubmit correctly', () => {
        apiServiceSpy.submitForm.and.returnValue(of({ result: 'success' }));
        spyOn(window, 'alert');
        component.finalSubmit([]);

        expect(apiServiceSpy.submitForm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('success');
        expect(component.formArray.length).toBe(1);
    });

    it('should not submit if the form is invalid', () => {
        spyOn(component, 'finalSubmit');

        component.submitAll();
        fixture.detectChanges();

        expect(component.formArray.invalid).toBeTrue();
        expect(component.finalSubmit).not.toHaveBeenCalled();
    });
});
