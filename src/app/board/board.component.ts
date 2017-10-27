import { Component, OnInit } from '@angular/core';
import { v4 } from 'uuid';

import { TrelloService } from '../shared/trello.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  board: any = { name: 'Working...' };
  stories: any = [];
  lists: any = [];
  tasks: any = [];
  members: any = [];

  hideTaskMenu: boolean = true;

  constructor(
    private trello: TrelloService) { }

  ngOnInit(): void {
    this.trello.authenticate();

    this.trello.boardChanged.subscribe((board) => {
      this.board = board;

      document.body.style.backgroundColor = board.prefs.backgroundColor;

      let sListIndex = board.lists.findIndex(l => l.name === 'Sprint Backlog');
      this.lists = board.lists.slice(sListIndex);
    });

    this.trello.storiesChanged.subscribe((stories) => {
      this.stories = stories;
    });

    this.trello.tasksChanged.subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.trello.membersChanged.subscribe((members) => {
      this.members = members;
    })

    let boardId = this.trello.boardId();
    if (boardId) {
      this.trello.boards(boardId, {
        lists: 'open',
        list_fields: 'id,name'});
    }

  }

  boardColor(): string {
    if (!this.board.id) {
      return '#127abd';
    }
    return this.board.prefs.backgroundColor;
  }

  private totalStoryPoints(stories): number {
    if (!stories) {
      return;
    }

    let total = 0;
    for (let s of stories) {
      total += s.points | 0;
    }
    return total;
  }

  private totalCompletedStoryPoints(stories: any): number {
    let doneList = this.lists.find(l => l.name === 'Done');

    if (!stories || !doneList) {
      return 0;
    }

    let total = 0;
    for (let s of stories) {
      let tasks = this.tasks.filter((t) => {
        return t.desc.indexOf('storyId:' + s.id) !== -1;
      });
      let done = tasks.filter((t) => {
        return t.idList === doneList.id;
      });
      if (tasks.length > 0 && tasks.length === done.length) {
        total += s.points | 0;
      }
    }

    return total;
  }

  private addTask(card: any): void {
    //let storyListIndex = this.lists.findIndex(l => card.idList === l.id);
    let nextList = this.lists[1];
    if (!nextList) {
      return;
    }

    let newTask = {
      id: 'new-' + v4(),
      desc: '**' + card.name + "**\n\n" + 'storyId:' + card.id,
      idMembers: [],
      idList: nextList.id,
      name: '',
      shortUrl: '',
      edit: true
    }
    this.tasks.push(newTask);
  }

  private cancelTask(task: any): void {
    task.edit = false;
    let taskIndex = this.tasks.findIndex(t => t.id === task.id);
    if (this.isNewTask(task)) {
      this.tasks.splice(taskIndex, 1);
    }
    else {
      this.trello.card(task.id)
        .then((card) => {
          this.tasks[taskIndex] = card;
        })
    }
  }

  private saveTask(task: any): void {
    if (this.isNewTask(task)) {
      this.trello.createCard(task.idList, task)
        .then(card => {
          let index = this.tasks.findIndex(t => t.id === task.id);
          this.tasks[index] = card;
        });
    }
    else {
      this.trello.updateCard(task.id, {
        desc: task.desc,
        name: task.name,
        idMembers: task.idMembers.join(',')
      });
    }
    task.edit = false;
  }

  private isNewTask(task: any): boolean {
    return task.id.indexOf('new-') > -1;
  }

  private onCardDrop(e: any, list: any, story: any): void {
    let card = e.dragData, desc;
    if (!card.id || this.isNewTask(card)) {
      return;
    }
    if (list.id === story.idList) {
      return;
    }

    let storyId = card.desc.match(/storyId:[a-z0-9]+/i);
    if (storyId) {
      desc = card.desc.replace(storyId, 'storyId:' + story.id);
    }
    else {
      desc = card.desc + "\n\n" + 'storyId:' + story.id;
    }

    card.idList = list.id;
    card.desc = desc;

    this.trello.updateCard(card.id, {
      idList: list.id,
      desc: desc
    });
  }


}
