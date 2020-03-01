import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  @Output() loginModeEmitter = new EventEmitter<string>();
  isLoading = false;
  private authStatusSub: Subscription;
  userLoginFormGroup: FormGroup;
  username = null;
  password = null;
  isPasswordCorrect: boolean;

  constructor(public authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(
        (authStatus: any) => {
          this.isLoading = false;
        }
      );

    this.userLoginFormGroup = this.formBuilder.group({
      emailText: ['', 
      [
        Validators.required,
        Validators.email
      ]],
      passwordText: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]]
    });
  }

  onLogin() {
    if (!this.userLoginFormGroup.valid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.userLoginFormGroup.value.emailText, this.userLoginFormGroup.value.passwordText)
      .subscribe(
        (userLoginDataResponse: any) => {
          this.isPasswordCorrect = true;
          this.authService.loginResponseHandle(userLoginDataResponse);
        },
        (error) => {
          this.isPasswordCorrect = false;
          this.isLoading = false;
        }
      );
  }

  loginMode(loginModeState) {
    this.loginModeEmitter.emit(loginModeState);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
