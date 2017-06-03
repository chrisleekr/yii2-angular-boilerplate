import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SamplePageComponent} from './sample-page.component';
import {SamplePageRoutingModule} from './sample-page-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SamplePageRoutingModule
    ],
    declarations: [
        SamplePageComponent,
    ]
})
export class SamplePageModule {
}
