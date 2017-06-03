import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IndexComponent} from './index.component';
import {IndexRoutingModule} from './index-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IndexRoutingModule
    ],
    declarations: [
        IndexComponent,
    ]
})
export class IndexModule {
}
