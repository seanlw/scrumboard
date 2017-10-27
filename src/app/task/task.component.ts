import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  AfterViewChecked } from '@angular/core';

import { TrelloService } from '../shared/trello.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, AfterViewChecked {

  @Input() card: any;

  @Output() cancelTask = new EventEmitter<any>();
  @Output() saveTask = new EventEmitter<any>();
  @Output() newTask = new EventEmitter<any>();

  @ViewChild('nameField') nameField;

  members: any[] = [];
  private hideMembers: boolean = true;

  constructor(
    private trello: TrelloService) { }

  ngOnInit(): void {
    this.members = this.trello.members;
    this.trello.membersChanged.subscribe((members) => {
      this.members = members;
    });
  }

  ngAfterViewChecked(): void {
    if (this.nameField) {
      this.nameField.nativeElement.focus();
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault();
      event.stopPropagation();

      if (this.card.id.indexOf('new-') > -1) {
        this.newTask.emit();
      }
      this.save();
    }
    else if(event.code === 'Escape') {
      this.cancel();
    }
  }

  editTask(): void {
    this.card.edit = true;
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  save(): void {
    this.saveTask.emit();
  }

  cancel(): void {
    this.cancelTask.emit();
  }

}
