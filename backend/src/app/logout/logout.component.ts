import { Component, OnInit } from '@angular/core';

import { StaffService } from '../model/staff.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-logout',
    template: '<strong>Logging out...</strong>',
})
export class LogoutComponent implements OnInit {

    public submitted:boolean = false;
    public error:string = '';

    constructor(private _staffService:StaffService, private _router:Router) { }

    ngOnInit() {
        this._staffService.logout();
        this._router.navigate(['/']);
    }


}
