import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { FormData } from '../interfaces/form';

describe('ApiService', () => {
    let apiService: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });

        apiService = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(apiService).toBeTruthy();
    });

    it('should check if username is available', () => {
        const username = 'testUser';
        const mockResponse = { isAvailable: true };

        apiService.checkUser(username).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/checkUsername');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ username });

        req.flush(mockResponse);
    });

    it('should submit form data', () => {
        const formData: FormData[] = [
            { country: 'USA', username: 'user new 1', birthday: '1990-01-01' },
            { country: 'Ukraine', username: 'user new 2', birthday: '1985-05-15' }
        ];
        const mockResponse = { result: 'Success' };

        apiService.submitForm(formData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/submitForm');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(formData);

        req.flush(mockResponse);
    });
});
