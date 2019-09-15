import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UserService } from './../model/user.service';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend-layout.component.html'
})
export class FrontendLayoutComponent implements OnInit, AfterViewChecked {
  public userData: any = {};
  public today: Date;

  constructor(public userService: UserService, private cdRef: ChangeDetectorRef) {
    this.today = new Date();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    const jwtValue: any = this.userService.getJWTValue();
    if (jwtValue !== null) {
      this.userData = jwtValue.data;
    }
  }
}
