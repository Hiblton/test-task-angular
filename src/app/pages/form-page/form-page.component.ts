import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormData } from '../../interfaces/form';
import { usernameAsyncValidator } from '../../validators/username.validator';
import { countryValidator } from '../../validators/country.validator';
import { birthdayValidator } from '../../validators/birthday.validator';
import { ApiService } from '../../services/api.service';
import { triggerValidation } from '../../utils/form-utils';
import { BehaviorSubject, Subscription, interval, map, takeWhile } from 'rxjs';

export const COUNTDOWN_DURATION = 15;

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPageComponent implements OnInit, OnDestroy {
  formArray: FormArray = this.fb.array([]);
  timeLeftCounterSubject$ = new BehaviorSubject<number>(0);
  private timerSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.addForm();
  }

  ngOnDestroy(): void {
    this.stopTimer();
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
    triggerValidation(this.formArray);

    if (this.formArray.invalid) return;

    this.startTimer();
    this.formArray.disable();
  }

  cancelSubmit() {
    this.stopTimer();
    this.formArray.enable();
  }

  finalSubmit(formData: FormData[]) {
    this.apiService.submitForm(formData).subscribe(({ result }) => {
      alert(result);

      this.formArray.clear();
      this.addForm();
    });
  }

  private startTimer(): void {
    this.timeLeftCounterSubject$.next(COUNTDOWN_DURATION);

    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timeLeftCounterSubject$.value > 0)
    ).subscribe({
      next: () => {
        this.timeLeftCounterSubject$.next(this.timeLeftCounterSubject$.value - 1);
      },
      complete: () => {
        this.finalSubmit(this.formArray.value);
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
