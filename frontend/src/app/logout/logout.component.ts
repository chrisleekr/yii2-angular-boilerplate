import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../model/user.service';

@Component({
  selector: 'app-logout',
  template: '<strong>Logging out...</strong>'
})
export class LogoutComponent implements OnInit {
  public submitted = false;
  public error = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
