import { AbstractControl, ValidationErrors, AsyncValidatorFn, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, map, first } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

export function usernameAsyncValidator(apiService: ApiService, formArray: FormArray): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }

        const usernames = formArray.controls
            .filter(formGroup => formGroup !== control.parent)
            .map(formGroup => formGroup.get('username')!.value);
        if (usernames.includes(control.value)) {
            return of({ duplicate: true });
        }

        return of(control.value).pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(username =>
                apiService.checkUser(username).pipe(
                    map(response => (response.isAvailable ? null : { unavailable: true })),
                    catchError(() => of(null))
                )
            )
        ).pipe(first());
    };
}
