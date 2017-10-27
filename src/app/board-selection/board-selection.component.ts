import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TrelloService } from '../shared/trello.service';

@Component({
  selector: 'board-selection',
  templateUrl: './board-selection.component.html',
  styleUrls: ['./board-selection.component.scss']
})
export class BoardSelectionComponent implements OnInit {

  boardurl: string;
  error: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trello: TrelloService) { }

  ngOnInit(): void {
    document.body.style.backgroundColor = '#fff';
    this.trello.authenticate();
  }

  onKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.continue();
    }
  }

  continue(): void {
    let id = this.boardurl.match(/^https:\/\/trello\.com\/b\/([^\/]*)\//i);
    if (id) {
      this.trello.setBoard(id[1]);
      this.router.navigateByUrl('/');
    }
    else {
      this.error = true;
    }
  }

}
