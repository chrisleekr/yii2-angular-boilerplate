import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {UserService} from './user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private _userService: UserService, private _router:Router) {}

    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
        let url:string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string):boolean{
        if(this._userService.isLoggedIn()) {  return true; }

        // Store the attempted URL for redirecting
        this._userService.redirectURL = url;

        // Navigate to the login page with extras
        this._router.navigate(['/login'], { queryParams: { r: url }});
        return false;
    }
}