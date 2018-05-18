import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { UserDataService } from '../model/user-data.service';
import { User } from '../model/user';
import { StaffService } from '../model/staff.service';

@Component({
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];
  errorMessage: string;

  constructor(private userDataService: UserDataService,
      private staffService: StaffService,
      private router: Router) {
  }

  ngOnInit() {
    this.getUsers();
  }

  public getUsers() {
    this.users = null;
    this.userDataService.getAllUsers()
        .subscribe(
            users => {
              this.users = users
            },
            error => {
              // unauthorized access
              if (error.status == 401 || error.status == 403) {
                this.staffService.unauthorizedAccess(error);
              } else {
                this.errorMessage = error.data.message;
              }
            }
        );
  }

  public viewUser(user: User): void {
    this.router.navigate(['/user', user.id]);
  }

  public confirmDeleteUser(user: User): void {
    // Due to sweet alert scope issue, define as function variable and pass to swal

    let parent = this;
    // let getUsers = this.getUsers;
    this.errorMessage = '';

    swal({
      title: 'Are you sure?',
      text: 'Once delete, you won\'t be able to revert this!',
      type: 'question',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: function () {
        return new Promise(function (resolve, reject) {
          parent.userDataService.deleteUserById(user.id)
                .subscribe(
                    result => {
                      parent.getUsers();
                      resolve();
                    },
                    error => {
                      // unauthorized access
                      if (error.status == 401 || error.status == 403) {
                        parent.staffService.unauthorizedAccess(error);
                      } else {
                        parent.errorMessage = error.data.message;
                      }
                      resolve();

                    }
                );
        })
      }
    }).then(function (result) {
      // handle confirm, result is needed for modals with input

    }, function (dismiss) {
      // dismiss can be "cancel" | "close" | "outside"
    });
  }
}
