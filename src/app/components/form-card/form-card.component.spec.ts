import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FormCardComponent } from './form-card.component';
import { Country } from '../../shared/enum/country';

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
});
