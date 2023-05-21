import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  credentials = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  
  submitted = false;
  isLogin = true;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  get credentialsCtrl() {
    return this.credentials.controls;
  }

  onSubmit(credentials: FormGroup) {

    if (!credentials.valid) {
      return;
    }
    const email = credentials.value.email;
    const password = credentials.value.password;

    this.authenticate(email, password);
    credentials.reset();
  }

  async authenticate(email: string, password: string) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    let authObs: Observable<AuthResponseData>;
    if (this.isLogin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      resData => {
        console.log(resData);
        loading.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      },
      errRes => {
        loading.dismiss();
        const code = errRes.error.error.message;
        let message = 'Could not sign you up, please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exists already!';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'E-Mail address could not be found.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'This password is not correct.';
        }
        this.showAlert(message);
      }
    );
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

}
