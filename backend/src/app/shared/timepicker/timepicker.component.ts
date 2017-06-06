/**
    This component is developed based on AngularJS Circular Time Picker(http://sidaudhi.github.io/angular-circular-timepicker) because there was no version for Angular 2.

    ----------------------------
    Example
    ----------------------------
    form.component.html

     <timepicker id="confirmed_at" [placeholderText]="'Click to set the date and time for confirming the user'" [dateTime]="_user.confirmed_at | amDateFormat: 'YYYY-MM-DD HH:mm'" [dateTimeFormat]="'YYYY-MM-DD HH:mm'" [clearLabel]="'Clear'" [confirmLabel]="'Confirm'" (onChangedDateTime)="onChangeDateTime('confirmed_at', $event)"></timepicker>
    ----------------------------
    form.component.ts

    public onChangeDateTime(type:string, dateTime:string) {
        let formattedDateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        if(type == 'confirmed_at') {
            this._staff.confirmed_at = formattedDateTime;
        }
    }
*/
import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'timepicker',
    templateUrl: 'timepicker.component.html',
    styleUrls: ['timepicker.component.css'],
})
export class TimepickerComponent implements OnInit, OnDestroy{

    private state:boolean = false;
    private tab:string = 'time';

    private config:any = {
        modal: true
    };
    private months:any = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    private dayNames:any = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    private minutes:Array<number> = [5,10,15,20,25,30,35,40,45,50,55,0];
    private hours:Array<number> = [1,2,3,4,5,6,7,8,9,10,11,12];

    private displayText:string = '';

    private days:any;
    private minute:number;
    private meridian:string;
    private hour:number;
    private datePreview:string;
    private timePreview:string;
    private displayMonth:string;
    private displayYear:string;
    private day:number;

    private _dateTime:string;


    @Input() set dateTime(dateTime:string) {
        if(dateTime == null) {
            return;
        }

        this.parseDateTime(dateTime);
        this.displayText = dateTime;
    }
    get dateTime():string {
        return this._dateTime;
    }

    @Input() dateTimeFormat:string = 'YYYY-MM-DD HH:mm';
    @Input() placeholderText:string = 'Click to set the date and time';
    @Input() clearLabel:string = 'Clear';
    @Input() confirmLabel:string = 'Confirm';

    @Output() onChangedDateTime = new EventEmitter<string>();


    ngAfterViewChecked() {}

    constructor() {}

    ngOnChanges(changes) {}

    ngOnInit() {}

    ngOnDestroy() {}

    private parseDateTime(dateTime:string) {
        let m = moment(dateTime);

        m = m.minute(5*Math.ceil(m.minute()/5));

        this.days = this.getDaysInMonth(m.year(),m.month());
        this.minute = m.minute();
        this.meridian = m.format('A');
        this.hour  = this.meridian == 'PM' ? m.hour() - 12: m.hour();
        if(this.hour==0) this.hour = 12;
        this.datePreview = m.format('YYYY-MM-DD');
        this.timePreview = m.format('hh:mm A');
        this.displayMonth = this.months[m.month()];
        this.displayYear = m.format('YYYY');
        this.day = m.date();
        this._dateTime = dateTime;

    }

    public setTab(newTab:string):void {
        this.tab = newTab;
    }

    public setDay(date:number):void {
        this.dateTime = moment(this.dateTime).date(date).format(this.dateTimeFormat);
    }

    public setState(state:boolean):void {
        this.state = false;
    }

    public toggleState():void{
        if(this.state == false && (this._dateTime == null || this._dateTime == "")) {
            this.parseDateTime(moment().format('YYYY-MM-DD HH:mm'));
        }
        this.state = !this.state;
    }

    public setMeridian(meridian:string):void {
        let m = moment(this.dateTime);
        this.meridian = meridian;

        if(meridian == 'AM') {
            if(m.hours() >= 12) {
                m = m.add(-12, 'hours');
                this.dateTime = m.format(this.dateTimeFormat);
            }
        } else {
            if(m.hours() < 12) {
                m = m.add(12, 'hours');
                this.dateTime = m.format(this.dateTimeFormat);
            }
        }
    }

    public setMinutes(minute:number):void {
        this.dateTime = moment(this.dateTime).minute(minute).format(this.dateTimeFormat);
    }

    public setHour(hour:number):void {
        if(this.meridian == 'PM' && hour < 12) {
            hour = hour + 12;
        }

        if(this.meridian == 'AM' && hour == 12) {
            hour = hour - 12;
        }
        this.dateTime = moment(this.dateTime).hour(hour).format(this.dateTimeFormat);
    }

    public getDaysInMonth(year:number, month:number):any {
        let days = [];
        for(let i=1;i<=31;i++){
            days.push(i);
        }

        let firstDayOfWeek = 0;
        let firstDayOfMonth = new Date(year, month, 1),
            lastDayOfMonth = new Date(year, month + 1, 0),
            lastDayOfPreviousMonth = new Date(year, month, 0),
            daysInMonth = lastDayOfMonth.getDate(),
            daysInLastMonth = lastDayOfPreviousMonth.getDate(),
            dayOfWeek = firstDayOfMonth.getDay(),
            leadingDays = (dayOfWeek - firstDayOfWeek + 7) % 7 || 7,
            trailingDays = days.slice(0, 6 * 7 - (leadingDays + daysInMonth));
        if (trailingDays.length > 7) {
            trailingDays = trailingDays.slice(0, trailingDays.length-7);
        }

        return {
            year: year,
            month: month,
            days: days.slice(0, daysInMonth),
            leadingDays: days.slice(- leadingDays - (31 - daysInLastMonth), daysInLastMonth),
            trailingDays: trailingDays
        };
    }

    public addMonth(increment:number):void {
        this.dateTime = moment(this.dateTime).add(increment, 'months').format(this.dateTimeFormat);
    }

    public addYear(increment:number):void {
        this.dateTime = moment(this.dateTime).add(increment, 'years').format(this.dateTimeFormat);
    }

    clickClear() {
        this._dateTime = null;
        this.displayText = '';
        this.onChangedDateTime.emit(null);
        this.toggleState();
    }

    clickConfirm() {
        let m = moment(this._dateTime);
        this.displayText = m.format(this.dateTimeFormat);

        this.onChangedDateTime.emit(m.format(this.dateTimeFormat));
        this.toggleState();
    }
}
