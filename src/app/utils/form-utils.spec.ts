import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { triggerValidation } from './form-utils';

describe('triggerValidation', () => {
    it('should mark all controls as touched and update their validity for FormGroup', () => {
        const formGroup = new FormGroup({
            control1: new FormControl(''),
            control2: new FormControl(''),
        });

        spyOn(formGroup, 'markAllAsTouched').and.callThrough();
        spyOn(formGroup.controls.control1, 'updateValueAndValidity').and.callThrough();
        spyOn(formGroup.controls.control2, 'updateValueAndValidity').and.callThrough();

        triggerValidation(formGroup);

        expect(formGroup.markAllAsTouched).toHaveBeenCalled();
        expect(formGroup.controls.control1.updateValueAndValidity).toHaveBeenCalledWith({ onlySelf: true });
        expect(formGroup.controls.control2.updateValueAndValidity).toHaveBeenCalledWith({ onlySelf: true });
    });

    it('should mark all controls as touched and update their validity for FormArray', () => {
        const formArray = new FormArray([
            new FormControl(''),
            new FormControl(''),
        ]);

        spyOn(formArray, 'markAllAsTouched').and.callThrough();
        spyOn(formArray.at(0), 'updateValueAndValidity').and.callThrough();
        spyOn(formArray.at(1), 'updateValueAndValidity').and.callThrough();

        triggerValidation(formArray);

        expect(formArray.markAllAsTouched).toHaveBeenCalled();
        expect(formArray.at(0).updateValueAndValidity).toHaveBeenCalledWith({ onlySelf: true });
        expect(formArray.at(1).updateValueAndValidity).toHaveBeenCalledWith({ onlySelf: true });
    });

    it('should mark the control as touched and update its validity for FormControl', () => {
        const formControl = new FormControl('');

        spyOn(formControl, 'markAsTouched').and.callThrough();
        spyOn(formControl, 'updateValueAndValidity').and.callThrough();

        triggerValidation(formControl);

        expect(formControl.markAsTouched).toHaveBeenCalled();
        expect(formControl.updateValueAndValidity).toHaveBeenCalledWith({ onlySelf: true });
    });
});
