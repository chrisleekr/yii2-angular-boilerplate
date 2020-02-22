import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Staff } from '../model/staff';
import { StaffDataService } from '../model/staff-data.service';
import { StaffList } from '../model/staff-list';
import { StaffService } from '../model/staff.service';

@Component({
  templateUrl: './staff-list.component.html'
})
export class StaffListComponent implements OnInit {
  staffList: StaffList;
  errorMessage: string;

  loading: boolean;
  searchParams: any;
  totalCount: number;
  currentPage: number;
  pageSize: number;

  constructor(
    private staffDataService: StaffDataService,
    private staffService: StaffService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.currentPage = typeof queryParams['page'] !== 'undefined' ? +queryParams['page'] : 1;

    // Load search params
    this.searchParams = {};

    // Override page
    this.searchParams.page = this.currentPage;

    if (typeof queryParams['q'] !== 'undefined') {
      this.searchParams.q = queryParams['q'] + '';
    }
  }

  onSearchFormSubmit() {
    this.searchParams.page = 1;
    this.currentPage = 1;
    this.getStaffs();
  }

  /**
   * Clear search params
   */
  clearSearchParams() {
    // Load search params
    this.searchParams = {};

    this.getStaffs();
  }

  /**
   * Handle page changed from pagination
   *
   * @param event
   */
  pageChanged(event: any): void {
    if (event.page !== this.currentPage) {
      this.currentPage = event.page;
      this.searchParams.page = this.currentPage;

      this.getStaffs();
    }
  }

  ngOnInit() {
    this.getStaffs();
  }

  public getStaffs() {
    this.staffList = null;
    this.loading = true;

    this.router.navigate([], { queryParams: this.searchParams });

    this.staffDataService.getAllStaffs(this.searchParams).subscribe(
      staffList => {
        this.staffList = staffList;
        this.totalCount = this.staffList.pagination.totalCount;
        this.pageSize = this.staffList.pagination.defaultPageSize;
        this.loading = false;
      },
      error => {
        // unauthorized access
        if (error.status === 401 || error.status === 403) {
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

    // tslint:disable-next-line: no-this-assignment
    const parent = this;
    // let getStaffs = this.getStaffs;
    this.errorMessage = '';

    Swal.fire({
      title: 'Are you sure?',
      text: "Once delete, you won't be able to revert this!",
      icon: 'question',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm() {
        parent.loading = true;
        return new Promise(resolve => {
          parent.staffDataService.deleteStaffById(staff.id).subscribe(
            _result => {
              parent.getStaffs();
              parent.loading = false;
              resolve();
            },
            error => {
              // unauthorized access
              if (error.status === 401 || error.status === 403) {
                parent.staffService.unauthorizedAccess(error);
              } else {
                parent.errorMessage = error.data.message;
              }
              resolve();
            }
          );
        });
      }
    });
  }
}
