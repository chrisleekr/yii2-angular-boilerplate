import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {StaffService} from './staff.service';
import {Staff} from './staff';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class StaffDataService {

    constructor(private _globalService:GlobalService,
                private _staffService:StaffService,
                private _authHttp: AuthHttp){
    }

    // POST /v1/staff
    addStaff(staff:Staff):Observable<any>{
        let headers = this.getHeaders();

        return this._authHttp.post(
            this._globalService.apiHost+'/staff',
            JSON.stringify(staff),
            {
                headers: headers
            }
            )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // DELETE /v1/staff/1
    deleteStaffById(id:number):Observable<boolean>{
        let headers = this.getHeaders();

        return this._authHttp.delete(
            this._globalService.apiHost+'/staff/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // PUT /v1/staff/1
    updateStaffById(staff:Staff):Observable<any>{
        let headers = this.getHeaders();

        return this._authHttp.put(
            this._globalService.apiHost+'/staff/'+staff.id,
            JSON.stringify(staff),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    private getHeaders():Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this._staffService.getToken(),
        });
    }
    // GET /v1/staff
    getAllStaffs(): Observable<Staff[]> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost+'/staff?sort=-id',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Staff[]>response.data;
            })
            .catch(this.handleError);
    }

    // GET /v1/staff/1
    getStaffById(id:number):Observable<Staff> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost+'/staff/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Staff>response.data;
            })
            .catch(this.handleError);
    }


    private handleError (error: Response | any) {

        let errorMessage:any = {};
        // Connection error
        if(error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: "Sorry, there was a connection error occurred. Please try again.",
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }

    public static getStatusTypes():Array<any>{
        return [
            {
                label: 'Active',
                value: 10
            },
            {
                label: 'Waiting Confirmation',
                value: 1
            },
            {
                label: 'Disabled',
                value: 0
            }
        ];
    }

    public static getRoleTypes():Array<any>{
        return [
            {
                label: 'Administrator',
                value: 99
            },
            {
                label: 'Staff',
                value: 50
            }
        ];
    }


    public getPermissionTypes():Observable<Array<any>>{
        let headers = this.getHeaders();

        return this._authHttp.get(
           this._globalService.apiHost+'/staff/get-permissions',
            {
                headers: headers
            }
        )
        .map(response => response.json())
        .map((response) => {
            return response.data;
        })
        .catch(this.handleError);
    }
}
