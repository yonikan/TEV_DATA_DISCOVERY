import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { VersionUpdateModalComponent } from '../components/version-update-modal/version-update-modal.component';
import { UiComponentsService } from '../services/ui-components.service';

@Injectable()
export class VersionUpdateInterceptor implements HttpInterceptor {
	constructor(
		private authService: AuthService,
		private dialog: MatDialog,
		private localStorageService: LocalStorageService,
		private uiComponentsService: UiComponentsService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			filter(event => event instanceof HttpResponse),
			tap((event: HttpResponse<any>) => {
				const latestAppVersion = event.headers.get('app-version');
				const localAppVersion = this.localStorageService.getOnLocalStorage('app-version');
				if (localAppVersion && latestAppVersion && localAppVersion !== latestAppVersion) {
					this.localStorageService.storeOnLocalStorage('app-version', null);
					this.uiComponentsService.setIsSidepanelOpen(false);
					this.showUpdateVersionModal();
					this.authService.logout();
				}
				return event;
			})
		);
	}

	showUpdateVersionModal() {
		const modalTitle = 'version update error';
		const modalMessage = 'App version needs to update, please re-login.';
		this.dialog.open(VersionUpdateModalComponent, {
			width: '500px',
			height: '200px',
			data: {
				title: modalTitle,
				message: modalMessage
			}
		});
		this.authService.logout();
	}

}
