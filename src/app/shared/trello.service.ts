import { Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { trelloKey } from '../../trello-key';

@Injectable()
export class TrelloService {

  private version        = '1';
  private apiEndpoint    = 'https://api.trello.com';
  private authEndpoint   = 'https://trello.com';
  private intentEndpoint = 'https://trello.com';
  private localStorage: any = localStorage;
  private baseUrl = '';

  public board: any;
  public members: any[] = [];
  public cards: any[] = [];

  @Output() boardChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() membersChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() cardsChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() storiesChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() tasksChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: Http) {
    let base = document.getElementsByTagName('base')[0];
    this.baseUrl = base.baseURI;
  }

  public authenticate(): void {
    let authParams = {
      redirect_uri: this.baseUrl + 'authenticated',
      callback_method: 'fragment',
      scope: 'read,write',
      expiration: 'never',
      name: 'Scrum Board',
      key: trelloKey,
      response_type: 'token'
    };

    if (this.isAuthenticated()) {
      return;
    }

    window.location.href = this.authEndpoint + '/' + this.version + '/authorize?' +
      this.params(authParams);
  }

  public setAuthentication(token: string): void {
    this.setToken(token);
  }

  public isAuthenticated(): boolean {
    let token = this.getToken();
    return token !== null && token !== '';
  }

  public boardId(): string {
    let id = this.getBoardId();
    if (!id) {
      window.location.href = this.baseUrl + 'boards';
      return null;
    }
    return id;
  }

  public getBoardId(): string {
    return this.localStorage.getItem('board');
  }

  public setBoard(id: string): void {
    this.localStorage.setItem('board', id);
  }

  public clearBoard(): void {
    this.localStorage.removeItem('board');
  }

  public boards(id: string, params?: any): Promise<any> {
    return this.request('boards/' + id, params)
      .then((board) => {
        this.board = board;
        this.boardChanged.emit(board);

        this.boardMembers(board.id);
        this.cardsFromBoard(board.id, 'open');

        return board;
      });
  }

  public cardsFromList(id: string): Promise<any> {
    return this.request('lists/' + id + '/cards');
  }

  public cardsFromBoard(id: string, filter?: string): Promise<any> {
    return this.request('boards/' + id + '/cards' + (filter ? '/' + filter : ''))
      .then((cards) => {
        this.cards = cards;
        this.stories(cards);
        this.tasks(cards);

        this.cardsChanged.emit(cards);
        return cards;
      });
  }

  public boardMembers(id: string): Promise<any> {
    return this.request('boards/' + id + '/members', { fields: 'all' })
      .then((members) => {
        this.members = members;
        this.membersChanged.emit(members);
        return members;
      });
  }

  public member(id: string): Promise<any> {
    let member = this.members.find((m) => { return m.id === id; });
    if (member) {
      return Promise.resolve(member);
    }

    return Promise.resolve(null);
  }

  public card(id: string, params?: any): Promise<any> {
    return this.request('cards/' + id, params);
  }

  public createCard(idList: string, params: any): Promise<any> {
    params = {...params,
      idList: idList
    }
    return this.request('cards', params, 'post');
  }

  public updateCard(id: string, params: any): Promise<any> {
    return this.request('cards/' + id, params, 'put');
  }

  private request(action: string, params?: any, method: string = 'get'): Promise<any> {
    let url = this.apiEndpoint + '/' + this.version + '/' + action;
    let options = this.requestOptions();

    if (params) {
      for (let key in params) {
        options.search.set(key, params[key]);
      }
    }

    if (method === 'put') {
      return this.http.put(url, '', options)
        .toPromise()
        .then(response => response.json());
    }
    if (method === 'post') {
      return this.http.post(url, '', options)
        .toPromise()
        .then(response => response.json());
    }
    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json());
  }

  private requestOptions(): any {
    let params = {
      key: trelloKey,
      token: this.getToken()
    }

    let searchParams = new URLSearchParams();
    if (params) {
      for (let key in params) {
        searchParams.set(key, params[key]);
      }
    }

    return new RequestOptions({
      search: searchParams
    });
  }

  private params(obj: any): string {
    let paramString = '';
    for (let key in obj) {
      paramString += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    return paramString.slice(0, -1);
  }

  private getToken(): string {
    return this.localStorage.getItem('token');
  }

  private setToken(token: string): void {
    this.localStorage.setItem('token', token);
  }

  private clearToken(): void {
    this.localStorage.removeItem('token');
  }

  private stories(cards: any): void {
    let stories = [];
    let sprintBacklogList = this.board.lists.find(l => l.name === 'Sprint Backlog');

    for( let c of cards ) {
      if (c.idList === sprintBacklogList.id) {
        stories.push(this.formatCard(c));
      }
    }
    this.storiesChanged.emit(stories);
  }

  private tasks(cards: any): void {
    let tasks = [];
    let sprintBacklogListIndex = this.board.lists.findIndex(l => l.name === 'Sprint Backlog');
    let taskLists = this.board.lists.slice(sprintBacklogListIndex + 1);

    for (let c of cards) {
      if (this.cardInList(c, taskLists)) {
        tasks.push(c);
      }
    }
    this.tasksChanged.emit(tasks);
  }

  private cardInList(card: any, taskLists: any[]): boolean {
    return taskLists.find(l => l.id === card.idList) ? true : false;
  }

  private formatCard(card: any): any {
    let newCard = {
      ...card,
      points: this.storyPoint(card)
    };
    newCard.name = card.name.replace(/^\(\d+\)\s/i, '');
    return newCard;
  }

  private storyPoint(card: any): string {
    let point = card.name.match(/^\((\d+|\?)\)\s/i);
    return point[1] || '';
  }


}
