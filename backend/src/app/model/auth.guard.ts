import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {StaffService} from './staff.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private _staffService: StaffService, private _router:Router) {}

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
        let url:string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string):boolean{
        if(this._staffService.isLoggedIn()) {  return true; }

        // Store the attempted URL for redirecting
        this._staffService.redirectURL = url;

        // Navigate to the login page with extras
        this._router.navigate(['/login'], { queryParams: { r: url }});
        return false;
    }
}