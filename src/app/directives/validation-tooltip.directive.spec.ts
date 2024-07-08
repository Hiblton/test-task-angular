import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, UntypedFormArray } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ValidationTooltipDirective } from './validation-tooltip.directive';
import { ApiService } from './../services/api.service';
import { of } from 'rxjs';
import { usernameAsyncValidator } from '../validators/username.validator';

class MockApiService {
    checkUser(username: string) {
        const isAvailable = username !== 'existingUser';
        return of({ isAvailable });
    }
}

@Component({
    template: `
    <form [formGroup]="form">
      <input type="text" formControlName="username" appValidationTooltip placeholder="Username">
    </form>
  `
})
class TestComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder, private apiService: ApiService) {
        this.form = this.fb.group({
            username: this.fb.control('', [Validators.required], [usernameAsyncValidator(this.apiService, new UntypedFormArray([]))]),
        });
    }
}

describe('ValidationTooltipDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent, ValidationTooltipDirective],
            imports: [FormsModule, ReactiveFormsModule],
            providers: [
                { provide: ApiService, useClass: MockApiService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.directive(ValidationTooltipDirective));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show validation message on invalid input', fakeAsync(() => {
        const input = inputEl.nativeElement as HTMLInputElement;

        input.value = '';
        input.dispatchEvent(new Event('input'));
        tick(300); // Adjust time to match debounce time in async validator
        fixture.detectChanges();

        const tooltip = document.querySelector('.tooltip.bs-tooltip-bottom');
        expect(tooltip).toBeTruthy();

        const message = tooltip?.textContent?.trim();
        expect(message).toBe('Please provide a correct Username.');
    }));

    it('should remove validation message on valid input', fakeAsync(() => {
        const input = inputEl.nativeElement as HTMLInputElement;

        input.value = 'validUser';
        input.dispatchEvent(new Event('input'));
        tick(300);
        fixture.detectChanges();

        const tooltip = document.querySelector('.tooltip.bs-tooltip-bottom');
        expect(tooltip).toBeFalsy();
    }));
});
