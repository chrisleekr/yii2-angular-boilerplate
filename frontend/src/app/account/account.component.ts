import { Component, OnInit } from '@angular/core';
import { UserService } from '../model/user.service';
import { User } from '../model/user';
import { UserDataService } from '../model/user-data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  errorMessage: string;

  mode: string;
  user: User;

  constructor(private userService: UserService, private userDataService: UserDataService) {
    this.errorMessage = '';
    this.mode = '';
    this.user = new User();
  }

  public ngOnInit() {
    this.errorMessage = '';
    this.userDataService.getMe().subscribe(
      user => {
        this.user = user;
        this.mode = 'view';
      },
      error => {
        // unauthorized access
        if (error.status === 401 || error.status === 403) {
          this.userService.unauthorizedAccess(error);
        } else {
          this.errorMessage = error.data.message;
        }
      }
    );
  }
}
