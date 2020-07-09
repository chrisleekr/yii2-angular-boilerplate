import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { GlobalService } from './global.service';
import { StaffService } from './staff.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private staffService: StaffService, private globalService: GlobalService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.globalService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.staffService.redirectURL = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login'], { queryParams: { r: url } });
    return false;
  }
}
