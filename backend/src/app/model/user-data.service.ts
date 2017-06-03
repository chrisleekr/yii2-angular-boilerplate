import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {StaffService} from './staff.service';
import {User} from './user';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class UserDataService {

    constructor(private _globalService:GlobalService,
                private _staffService:StaffService,
                private _authHttp: AuthHttp){
    }

    // POST /v1/user
    addUser(user:User):Observable<any>{
        let headers = this.getHeaders();

        return this._authHttp.post(
            this._globalService.apiHost+'/user',
            JSON.stringify(user),
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

    // DELETE /v1/user/1
    deleteUserById(id:number):Observable<boolean>{
        let headers = this.getHeaders();

        return this._authHttp.delete(
            this._globalService.apiHost+'/user/'+id,
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

    // PUT /v1/user/1
    updateUserById(user:User):Observable<any>{
        let headers = this.getHeaders();

        return this._authHttp.put(
            this._globalService.apiHost+'/user/'+user.id,
            JSON.stringify(user),
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
    // GET /v1/user
    getAllUsers(): Observable<User[]> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost+'/user?sort=-id',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <User[]>response.data;
            })
            .catch(this.handleError);
    }

    // GET /v1/user/1
    getUserById(id:number):Observable<User> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost+'/user/'+id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <User>response.data;
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
                label: 'Disabled',
                value: 0
            }
        ];
    }
}
