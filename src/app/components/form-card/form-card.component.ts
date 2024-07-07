import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Country } from '../../shared/enum/country';
import { Form } from '../../interfaces/form';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
})
export class FormCardComponent {
  @Input({ required: true }) formGroup!: FormGroup<Form>;
  countries = Object.values(Country);

  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);

    if (control?.untouched || control?.valid) return '';

    if (control?.hasError('required')) {
      return `Please provide a correct ${controlName}.`;
    } else if (control?.hasError('invalidCountry')) {
      return 'Please provide a correct Country';
    } else if (control?.hasError('unavailable')) {
      return 'This username is not available';
    } else if (control?.hasError('duplicate')) {
      return 'This username is already used in another form';
    } else if (control?.hasError('invalidBirthday')) {
      return 'Birthdays cannot be later than the current date';
    }

    return '';
  }
}
