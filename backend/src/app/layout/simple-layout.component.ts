import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple',
  template: '<router-outlet></router-outlet>'
})
export class SimpleLayoutComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
