import { Component, OnInit } from '@angular/core';
import {UserService} from "../model/user.service";

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend-layout.component.html'
})
export class FrontendLayoutComponent implements OnInit {

  public userData:any = {};

  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    let jwtValue:any = this._userService.getJWTValue();
    if(jwtValue != null) {
      this.userData = jwtValue.data;
    }
  }
}
