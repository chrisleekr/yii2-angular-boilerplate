import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { StaffDataService } from '../model/staff-data.service';
import { Staff } from '../model/staff';
import { StaffService } from '../model/staff.service';

@Component({
  templateUrl: './staff-list.component.html',
})
export class StaffListComponent implements OnInit {
  staffs: Staff[];
  errorMessage: string;

  constructor(private staffDataService: StaffDataService,
      private staffService: StaffService,
      private router: Router) {
  }

  ngOnInit() {
    this.getStaffs();
  }

  public getStaffs() {
    this.staffs = null;
    this.staffDataService.getAllStaffs()
        .subscribe(
            staffs => {
              this.staffs = staffs
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

  public viewStaff(staff: Staff): void {
    this.router.navigate(['/staff', staff.id]);
  }

  public confirmDeleteStaff(staff: Staff): void {
    // Due to sweet alert scope issue, define as function variable and pass to swal

    let parent = this;
    // let getStaffs = this.getStaffs;
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
          parent.staffDataService.deleteStaffById(staff.id)
                .subscribe(
                    result => {
                      parent.getStaffs();
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
