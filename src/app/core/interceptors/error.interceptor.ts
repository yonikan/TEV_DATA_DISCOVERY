import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let modalTitle;
          let modalMessage;

          if(false) {
          // if(error.status === 401) {
            // modalTitle = 'Session Idle';
            // modalMessage = 'You are logged out because of session idle';
            // this.dialog.open(ErrorModalComponent, {
            //   width: '500px',
            //   height: '200px',
            //   data: { 
            //     title: modalTitle,
            //     message: modalMessage
            //   }
            // });
            // this.authService.logout();
          } else {
            modalMessage = 'An unknown error occurred!';

            if(error.status === 500) {
              modalTitle = 'Error 500';
            } else if (error.status === 400) {
              modalTitle = 'Error 400';
              return throwError(error);
            } else if (error.status === 403) {
              modalTitle = 'Error 403';
            } else if (error.status === 404) {
              modalTitle = 'Error 404';
              return throwError(error);
            } else if (error.status === 401) {
              modalTitle = 'Error 401';
              return throwError(error);
            } else if (error.status === 412) {
              modalTitle = 'Error 412';
              if (error.error.errorMessageId === 'pmErrorLoginBadLoginDetails') {
                modalMessage = 'Bad login details';
              } else if (error.error.errorMessageId === 'pmErrorLoginPasswordExpiry') { // TODO need to know the ids
                modalMessage = 'Your password has been expired'; // TODO need to know texts
              }
            } else {
              modalTitle = 'General Error';
            }

            if (error.error.errorMessageId !== 'pmErrorLoginBadLoginDetails') {
              this.dialog.open(ErrorModalComponent, {
                width: '500px',
                height: '200px',
                data: { 
                  title: modalTitle,
                  message: modalMessage
                }
              });
            }
          }

          return throwError(error);
        })
      );
  }
}
