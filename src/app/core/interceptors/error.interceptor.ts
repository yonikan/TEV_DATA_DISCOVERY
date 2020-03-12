import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Errors } from '../enums/errors.enum';
import { TranslateService } from '@ngx-translate/core';
import { UiComponentsService } from '../services/ui-components.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private router: Router,
		private translationService: TranslateService,
		private uiComponentsService: UiComponentsService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					let modalTitle = this.getTranslatedError('generalError');
					let modalMessage = this.getTranslatedError('generalErrorMessage');

					if (error.status) {
						modalTitle = `Error ${error.status}`;
						if (error.status === 401) {
							modalTitle = this.getTranslatedError('sessionIdle');
							modalMessage = this.getTranslatedError('sessionIdleMessage');
							this.authService.logout();
						} else if(error.status === 412) {
							if (error.error) {
								modalMessage = this.getTranslatedError(error.error.errorMessageId);
							}
							this.authService.logout();
						}
					}

					this.dialog.open(ErrorModalComponent, {
						width: '500px',
						height: '200px',
						data: {
							title: modalTitle,
							message: modalMessage
						}
					})
					.afterClosed()
					.subscribe(modalData => this.onCloseModal(error.error));

					return throwError(error);
				})
			);
	}

	onCloseModal(error) {
		if (this.isRequireResetPassword(error)) {
			this.router.navigate(['/login'], {queryParams: {page: 'reset-password'}});
		} else if (this.isResetPasswordExpired(error)) {
			this.router.navigate(['/login'], {queryParams: {page: 'forgot-password'}});
		}
		this.uiComponentsService.setIsSidepanelOpen(false);
	}

	isRequireResetPassword(error): boolean {
		if (!error) {
			return false;
		}
		return error.errorMessageId === Errors.LOGIN_PASSWORD_EXPIRED;
	}

	isResetPasswordExpired(error) {
		if (!error) {
			return false;
		}
		return error.errorMessageId === Errors.RESET_PASSWORD_EXPIRED;
	}

	getTranslatedError(errorMessageId) {
		const translation: any = this.translationService.get(`errors.${errorMessageId}`);
		return translation.value;
	}
}
