import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { StaffService } from '../model/staff.service';

@Component({
  selector: 'app-logout',
  template: '<strong>Logging out...</strong>'
})
export class LogoutComponent implements OnInit {
  public submitted: boolean = false;
  public error: string = '';

  constructor(private _staffService: StaffService, private _router: Router) {}

  ngOnInit() {
    this._staffService.logout();
    this._router.navigate(['/']);
  }
}
