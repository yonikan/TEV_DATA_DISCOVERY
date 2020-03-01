import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TranslationPickerService } from '../../core/services/translation-picker.service';
import { AuthService } from '../auth.service';
import { fadeInRightAnimation } from '../../core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../core/animations/fade-in-up.animation';
import { AuthorizationService } from '../../core/services/authorization.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = 'user-login';
  userToken: string;
  currentTranslation = 'en';
  languages: any[] = [
    { value: 'en', viewValue: 'English', img: './assets/svg/flags/flag-us.svg' },
    { value: 'es', viewValue: 'Espanol', img: './assets/svg/flags/flag-es.svg' },
    { value: 'ch', viewValue: '中文', img: './assets/svg/flags/flag-china.svg' }
  ];
  isAuthenticated = false;
  private authStatusSub: Subscription;
  isTranslationPickerFeatureEnabled = true;
  userEmailAddress = 'test@test.com'; // for the email sent comp
  frontendVersion = '';

  constructor(
    private translationPickerService: TranslationPickerService,
    public authService: AuthService,
    private authorizationService: AuthorizationService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('Front-end v.2.20.0.17');
    // this.isTranslationPickerFeatureEnabled = this.authorizationService.isFeatureEnabled('loginTranslationPicker') ? true : false;

    this.route.queryParams
      .pipe(
        filter(params => params.page)
      )
      .subscribe(params => {
        this.loginMode = params.page;
        this.userToken = params.token;
      });

    this.currentTranslation = this.translationPickerService.getCurrentTranslation();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isAuthenticated = authStatus;
      });
  }

  onLoginModeEmitter(loginModeString) {
    this.loginMode = loginModeString;
  }

  onUserEmailAddressEmitter(userEmailAddressString) {
    this.userEmailAddress = userEmailAddressString;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
