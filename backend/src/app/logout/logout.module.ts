import {NgModule} from '@angular/core';

import {LogoutComponent} from './logout.component';
import {LogoutRoutingModule} from './logout-routing.module';

@NgModule({
    imports: [
        LogoutRoutingModule
    ],
    declarations: [
        LogoutComponent
    ]
})
export class LogoutModule {
}
