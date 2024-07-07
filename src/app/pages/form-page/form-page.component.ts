import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormData } from '../../interfaces/form';
import { usernameAsyncValidator } from '../../validators/username.validator';
import { countryValidator } from '../../validators/country.validator';
import { birthdayValidator } from '../../validators/birthday.validator';
import { ApiService } from '../../services/api.service';

export const TIMER_COUNTDOWN = 15;

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  formArray: FormArray = this.fb.array([]);
  timeLeftCounter: number = 0;
  timer: any; // NodeJS.Timeout

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.addForm();
  }

  addForm() {
    if (this.formArray.length >= 10) return;

    const formGroup = new FormGroup<Form>({
      country: this.fb.control('', [Validators.required, countryValidator()]),
      username: this.fb.control('', [Validators.required], [usernameAsyncValidator(this.apiService, this.formArray)]),
      birthday: this.fb.control('', [Validators.required, birthdayValidator()]),
    })

    this.formArray.push(formGroup);
  }

  getFormGroup(index: number): FormGroup<Form> {
    return this.formArray.at(index) as FormGroup<Form>;
  }

  submitAll() {
    this.formArray.markAllAsTouched();

    if (this.formArray.invalid) return;

    this.formArray.disable();
    this.timeLeftCounter = TIMER_COUNTDOWN;
    this.timer = setInterval(() => {
      if (this.timeLeftCounter > 0) {
        this.timeLeftCounter--;
      } else {
        this.finalSubmit(this.formArray.value);
        clearInterval(this.timer);
      }
    }, 1000);
  }

  cancelSubmit() {
    clearInterval(this.timer);
    this.formArray.enable();
  }

  finalSubmit(formData: FormData[]) {
    this.apiService.submitForm(formData).subscribe(({ result }) => {
      alert(result);

      this.formArray.clear();
      this.addForm();
    });
  }
}
