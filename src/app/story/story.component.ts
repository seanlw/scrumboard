import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TrelloService } from '../shared/trello.service';

@Component({
  selector: 'story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent {

  @Input() card: any;
  @Output() addTask = new EventEmitter<any>();

  constructor(
    private trello: TrelloService) { }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  addNewTask(): void {
    this.addTask.emit();
  }


}
