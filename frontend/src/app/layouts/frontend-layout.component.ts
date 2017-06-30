import {Component, OnInit} from '@angular/core';
import {UserService} from "../model/user.service";

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend-layout.component.html'
})
export class FrontendLayoutComponent implements OnInit {

    public disabled: boolean = false;
    public status: { isopen: boolean } = {isopen: false};

    public userData: any = {};

    constructor(private _userService: UserService) {
    }

    ngOnInit(): void {
        let jwtValue: any = this._userService.getJWTValue();
        if (jwtValue != null) {
            this.userData = jwtValue.data;
        }
    }

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }
}
