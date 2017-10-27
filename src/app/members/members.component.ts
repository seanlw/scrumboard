import { Component,
         Input,
         Output,
         EventEmitter,
         ElementRef,
         OnInit,
         Renderer,
         HostListener } from '@angular/core';

import { TrelloService } from '../shared/trello.service';

@Component({
  selector: 'members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  members: any;

  @Input() idMembers: any;
  @Input() card: any;

  @Output() hideMembers: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private trello: TrelloService,
    private el: ElementRef,
    private renderer: Renderer) { }

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    this.hideMembers.emit();
  }

  ngOnInit(): void {
    this.members = this.trello.members;
    this.trello.membersChanged.subscribe((members) => {
      this.members = members
    });
    this.positionSelf();
  }

  positionSelf(): void {
    let view = this.el.nativeElement.querySelector('.members');
    let bounds = view.getBoundingClientRect();

    if (bounds.right > window.innerWidth) {
      this.renderer.setElementStyle(view, 'left', window.innerWidth - bounds.right + 'px');
    }
  }

  selected(id: string): string {
    let classes = ['member'];
    if (this.idMembers.find(m => id === m)) {
      classes.push('selected');
    }
    return classes.join(' ');
  }

  toggleMember(id: string, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    let member = this.card.idMembers.findIndex(m => m === id);
    if (member > -1) {
      this.card.idMembers.splice(member, 1);
    }
    else {
      this.card.idMembers.push(id);
    }
    this.idMembers = this.card.idMembers;
  }

}
