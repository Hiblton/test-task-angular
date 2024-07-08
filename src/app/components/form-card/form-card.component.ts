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
}
