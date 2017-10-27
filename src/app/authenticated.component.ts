import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TrelloService } from './shared/trello.service';

@Component({
  selector: 'authenticated',
  template: `
    <h1>Authenticating</h1>
    <h2 *ngIf="failed">Failed to authenticate</h2>
  `
})
export class AuthenticatedComponent implements OnInit {

  failed: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trello: TrelloService) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string) => {
      if(fragment && fragment.indexOf('token=') > -1) {
        let token = fragment.replace('token=', '');
        this.trello.setAuthentication(token);
        this.router.navigateByUrl('/');
      }
      else {
        this.failed = true;
      }
    });
  }


}
