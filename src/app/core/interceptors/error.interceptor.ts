import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private dialog: MatDialog, private authService: AuthService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					let modalTitle = 'General Error';
					let modalMessage = 'An unknown error occurred!';

					if (error.status) {
						modalTitle = `Error ${error.status}`;
						if (error.status === 401) {
							modalTitle = 'Session Idle';
							modalMessage = 'You are logged out because of session idle.';
							this.authService.logout();
						} else if(error.status === 412) {
							if (error.error) {
								if (error.error.errorMessageId === 'pmErrorLoginBadLoginDetails') {
									modalMessage = 'Bad login details';
								} else if (error.error.errorMessageId === 'pmErrorLoginPasswordExpiry') {
									modalMessage = 'Your password has been expired';
								}
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
					});

					return throwError(error);
				})
			);
	}
}
