import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FormData } from "../interfaces/form";

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) {}

    checkUser(username: string): Observable<{ isAvailable: boolean }> {
        return this.http.post<{ isAvailable: boolean }>('/api/checkUsername', { username });
    }

    submitForm(formData: FormData[]): Observable<{ result: string }> {
        return this.http.post<{ result: string }>('/api/submitForm', formData);
    }
}
