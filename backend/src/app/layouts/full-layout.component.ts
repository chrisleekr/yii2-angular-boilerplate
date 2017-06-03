import { Component, OnInit } from '@angular/core';
import {StaffService} from '../model/staff.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    public userData:any = {};

    constructor(private _staffService:StaffService) { }

    public disabled:boolean = false;
    public status:{isopen:boolean} = {isopen: false};

    public toggled(open:boolean):void {
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {
        let jwtValue:any = this._staffService.getJWTValue();
        this.userData = jwtValue.data;

    }
}
