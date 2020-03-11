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

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private router: Router,
		private translationService: TranslateService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					let modalTitle = this.getTraslatedError('generalError');
					let modalMessage = this.getTraslatedError('generalErrorMessage');

					if (error.status) {
						modalTitle = `Error ${error.status}`;
						if (error.status === 401) {
							modalTitle = this.getTraslatedError('sessionIdle');
							modalMessage = this.getTraslatedError('sessionIdleMessage');
							this.authService.logout();
						} else if(error.status === 412) {
							if (error.error) {
								modalMessage = this.getTraslatedError(error.error.errorMessageId);
							}
							this.authService.logout();
						}
					}

					this.dialog.open(ErrorModalComponent, {
						width: '500px',
						height: '200px',
						data: {
							title: modalTitle,
							message: modalMessage,
							onClose: () => {
								if (this.isRequireResetPassword(error.error)) {
									this.router.navigate(['/login'], {queryParams: {page: 'reset-password'}});
								} else if (this.isResetPasswordExpired(error.error)) {
									this.router.navigate(['/login'], {queryParams: {page: 'forgot-password'}});
								}
							}
						}
					});

					return throwError(error);
				})
			);
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

	getTraslatedError(errorMessageId) {
		const trans: any = this.translationService.get(`errors.${errorMessageId}`);
		return trans.value;
	}
}
