import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../model/user.service';

@Component({
  selector: 'app-logout',
  template: '<strong>Logging out...</strong>'
})
export class LogoutComponent implements OnInit {
  public submitted: boolean = false;
  public error: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
