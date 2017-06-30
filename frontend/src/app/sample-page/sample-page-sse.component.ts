import {Component, OnInit, NgZone} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalService} from '../model/global.service';
import EventSource from 'event-source';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-sample-page-sse',
    templateUrl: './sample-page-sse.component.html',
})
export class SamplePageSSEComponent implements OnInit {
    private _id:number;
    private _parameters:any;

    constructor(private _globalService:GlobalService,
                private _activatedRoute:ActivatedRoute) {
    }


    private stocks;


    ngOnInit() {

        let observable = Observable.create(observer => {
            const eventSource = new EventSource(this._globalService.apiHost+'/page/sse');
            eventSource.onmessage = (message) => {

                observer.next(message);
            };
            eventSource.onerror = (error) => observer.error(error);

            return () => {
                eventSource.close();
            };
        });
        observable.subscribe({
            next: stocks => {
                this.stocks = JSON.parse(stocks.data);
            },
            error: err => {
                console.error('something wrong occurred: ', err);
            }
        });


    }


}
