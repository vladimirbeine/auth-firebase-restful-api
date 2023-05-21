import { FormControl } from "@angular/forms";

export interface UserSignup {
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    email: FormControl<string>;
    username: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }