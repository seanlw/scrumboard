import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthenticatedComponent } from './authenticated.component';
import { BoardComponent } from './board/board.component';
import { BoardSelectionComponent } from './board-selection/board-selection.component';
import { MembersComponent } from './members/members.component';
import { StoryComponent } from './story/story.component';
import { TaskComponent } from './task/task.component';

import { CardListFilterPipe } from './shared/card-list-filter.pipe';
import { MemberFilterPipe } from './shared/member-filter.pipe';
import { MissingStoryTaskFilterPipe } from './shared/missing-story-task-filter.pipe';
import { StoryTaskFilterPipe } from './shared/story-task-filter.pipe';

import { TrelloService } from './shared/trello.service';

import { Autosize } from './shared/autosize.directive';
import { MembersDirective } from './members/members.directive';

import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    Autosize,
    AuthenticatedComponent,
    BoardComponent,
    BoardSelectionComponent,
    MembersComponent,
    MembersDirective,
    StoryComponent,
    TaskComponent,

    CardListFilterPipe,
    MemberFilterPipe,
    MissingStoryTaskFilterPipe,
    StoryTaskFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2DragDropModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
  ],
  entryComponents: [
    MembersComponent
  ],
  providers: [
    TrelloService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
