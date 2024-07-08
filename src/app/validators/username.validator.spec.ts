import { FormControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { usernameAsyncValidator } from './username.validator';
import { TestBed } from '@angular/core/testing';

describe('usernameAsyncValidator', () => {
    let apiService: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        const apiServiceSpy = jasmine.createSpyObj('ApiService', ['checkUser']);
        TestBed.configureTestingModule({
            providers: [
                { provide: ApiService, useValue: apiServiceSpy }
            ]
        });
        apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    });

    function createFormArrayWithUsernames(usernames: string[]): FormArray {
        return new FormArray(
            usernames.map(username => new FormGroup({
                username: new FormControl(username)
            }))
        );
    }

    it('should return null if control value is null', (done) => {
        const formArray = createFormArrayWithUsernames([]);
        const control = new FormControl(null);
        const validator = usernameAsyncValidator(apiService, formArray);
        (validator(control) as Observable<ValidationErrors | null>).subscribe(result => {
            expect(result).toBeNull();
            done();
        });
    });

    it('should return { duplicate: true } if username already exists in the form array', (done) => {
        const formArray = createFormArrayWithUsernames(['existingUser']);
        const control = new FormControl('existingUser');
        const validator = usernameAsyncValidator(apiService, formArray);
        (validator(control) as Observable<ValidationErrors | null>).subscribe(result => {
            expect(result).toEqual({ duplicate: true });
            done();
        });
    });

    it('should return { unavailable: true } if username is unavailable', (done) => {
        apiService.checkUser.and.returnValue(of({ isAvailable: false }));
        const formArray = createFormArrayWithUsernames([]);
        const control = new FormControl('unavailableUser');
        const validator = usernameAsyncValidator(apiService, formArray);

        control.setValue('unavailableUser');

        (validator(control) as Observable<ValidationErrors | null>).subscribe(result => {
            expect(result).toEqual({ unavailable: true });
            done();
        });
    });

    it('should return null if username is available', (done) => {
        apiService.checkUser.and.returnValue(of({ isAvailable: true }));
        const formArray = createFormArrayWithUsernames([]);
        const control = new FormControl('availableUser');
        const validator = usernameAsyncValidator(apiService, formArray);

        control.setValue('availableUser');

        (validator(control) as Observable<ValidationErrors | null>).subscribe(result => {
            expect(result).toBeNull();
            done();
        });
    });
});
