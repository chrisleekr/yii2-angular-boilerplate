import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html'
})
export class SamplePageComponent implements OnInit {
  id: number;
  parameters: any;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.parameters = this.activatedRoute.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.id = Number.parseInt(params.id, 10);
      } else {
        // do something here
      }
    });
  }
}
