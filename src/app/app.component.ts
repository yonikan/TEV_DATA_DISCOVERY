import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';
import { TranslationPickerService } from './core/services/translation-picker.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { ServerEnvService } from './core/services/server-env.service';
import { AuthorizationService } from './core/services/authorization.service';
import { ThemePickerService } from './core/theme-picker/theme-picker.service';
import { TeamPickerService } from './core/services/team-picker.service';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { UiComponentsService } from './core/services/ui-components.service';
import { TeamEventValidationService } from './team-event-validation/team-event-validation.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authStatusSub: Subscription;

  isSidepanelOpen = false;
  private sidepanelOpenSub: Subscription;
  sidepanelOpenTeamEventType: number;

  isLoading = false;
  private isLoadingSub: Subscription;
  teamEventId: number;
  isSidepanelTeamEventValidationFinished = false;

  constructor(
    public authService: AuthService,
    public authorizationService: AuthorizationService,
    private localStorageService: LocalStorageService,
    private translationPickerService: TranslationPickerService,
    private themePickerService: ThemePickerService,
    private uiComponentsService: UiComponentsService,
    public breakpointObserver: BreakpointObserver,
    private teamEventValidationService: TeamEventValidationService,
    private http: HttpClient,
    private router: Router,
    private serverEnvService: ServerEnvService) {
  }

  ngOnInit() {
    this.serverEnvService.initServerEnv();
    this.authorizationService.currentPlatform = this.breakpointObserver.isMatched('(min-width: 769px)') ? 'desktop' : 'mobile';

    if (this.localStorageService.getOnLocalStorage('selected_theme')) {
      this.themePickerService.setDefaultTheme(this.localStorageService.getOnLocalStorage('selected_theme'));
    } else {
      this.themePickerService.setDefaultTheme(this.themePickerService.getCurrentTheme());
    }

    if (this.localStorageService.getOnLocalStorage('selected_language')) {
      this.translationPickerService.setDefaultLang(this.localStorageService.getOnLocalStorage('selected_language'));
    } else {
      this.translationPickerService.setDefaultLang(this.translationPickerService.getCurrentTranslation());
	}

	this.authService.checkLogin();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isAuthenticated = authStatus;
      });

    this.sidepanelOpenSub = this.uiComponentsService
      .getSidepanelOpenListener()
      .subscribe((sidepanelOpen: any) => {
        this.teamEventId = sidepanelOpen.teamEventId;
        this.isSidepanelOpen = sidepanelOpen.isOpen;
        this.sidepanelOpenTeamEventType = sidepanelOpen.teamEventType;
        this.isSidepanelTeamEventValidationFinished = sidepanelOpen.isTeamEventValidationFinished;
        // console.log('this.sidepanelOpenTeamEventType: ', this.sidepanelOpenTeamEventType);
      });

    this.isLoadingSub = this.uiComponentsService
      .getIsLoadingListener()
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    if (!environment.production) {
      // this.authService.login('ofir.mossinson@playermaker.com', 'Mossinson12345'); // stage
    //   this.authService.login('yoni.kangun@playermaker.com', 'aaaAAA111'); // dev
      // this.authService.login('ofir.mossinson@playermaker.com', 'Mossinson12345');
    //   this.authService.login('yoni.kangun@playermaker.com', 'aaaAAA111')
    //     .subscribe(
    //       (userLoginDataResponse: any) => {
    //         this.authService.loginResponseHandle(userLoginDataResponse);
    //       },
    //       (error) => {
    //         console.log('error: ', error);
    //       }
    //     );
      // this.router.navigate(['/team-overview']);
    };
  }

  sidePanelClosed() {
    if (!this.isSidepanelTeamEventValidationFinished) {
      let PAYLOAD;
      let TEAM_EVENT_TYPE;
      if(this.sidepanelOpenTeamEventType === 1) {
        PAYLOAD = this.teamEventValidationService.getTrainingValidationData();
        TEAM_EVENT_TYPE = 'training';
      } else if (this.sidepanelOpenTeamEventType === 2) {
        PAYLOAD = this.teamEventValidationService.getMatchValidationData();
        TEAM_EVENT_TYPE = 'match';
      }
      const PATH = this.serverEnvService.getBaseUrl();
      this.http.post<any>(`${PATH}/v3/${TEAM_EVENT_TYPE}/${this.teamEventId}/draft`, PAYLOAD)
        .subscribe(
          (resp: any) => {

          },
          (error) => {

          }
        );
    }
    this.sidepanelOpenTeamEventType = 0; // needs 0 to reset the ngIf
    this.isSidepanelOpen = false;
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
    this.sidepanelOpenSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
  }
}
