import { FormControl, FormGroup } from "@angular/forms";

export interface Form {
    country: FormControl<string | null>;
    username: FormControl<string | null>;
    birthday: FormControl<string | null>;
}

export interface FormData {
    country: string | null;
    username: string | null;
    birthday: string | null;
}
