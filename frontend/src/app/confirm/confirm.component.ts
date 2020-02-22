import { Component, OnInit } from '@angular/core';
import { UserService } from '../model/user.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit {
  submitted = false;
  errorMessage = '';
  isConfirmed = false;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.userService.logout();

    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (typeof params.id !== 'undefined' && typeof params.auth_key !== 'undefined') {
        const id = params.id;
        const auth_key = params.auth_key;
        this.onConfirm(id, auth_key);
      } else {
        this.errorMessage = 'The parameters are missing. Please check your access';
      }
    });
  }

  private onConfirm(id: number, authKey: string) {
    this.errorMessage = '';
    this.submitted = true;
    this.isConfirmed = false;

    this.userService.signupConfirm(id, authKey).subscribe(
      result => {
        if (result.success) {
          // show confirmation
          this.isConfirmed = true;
        } else {
          this.errorMessage = 'Account confirmation is failed. Please check and try again.';
          this.submitted = false;
          this.isConfirmed = false;
        }
      },
      error => {
        if (typeof error.data.message !== 'undefined') {
          try {
            const message = JSON.parse(error.data.message);
            let errorMessage = '';

            for (const m of Object.keys(message)) {
              errorMessage += message[m] + '\n';
            }

            this.errorMessage = errorMessage;
          } catch (e) {
            this.errorMessage = error.data.message;
          }
        } else {
          this.errorMessage = error.data;
        }

        this.submitted = false;
        this.isConfirmed = false;
      }
    );
  }
}
