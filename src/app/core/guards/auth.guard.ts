import { CanActivate, CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  authCheck(): boolean | Observable<boolean> | Promise<boolean> {
	return this.authService.getIsAuth().pipe(map(isAuth => {
		if (!isAuth) {
			this.router.navigate(['/login']);
		}
		return isAuth;
	}));
  }

  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
	return this.authCheck();
  }

  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
	return this.authCheck();
  }
}
