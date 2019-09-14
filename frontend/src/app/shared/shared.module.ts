import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, MomentModule],
  declarations: [SpinnerComponent],
  exports: [FormsModule, ReactiveFormsModule, MomentModule, SpinnerComponent],
  providers: []
})
export class SharedModule {}
