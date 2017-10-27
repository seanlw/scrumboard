import { Routes } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { BoardSelectionComponent } from './board-selection/board-selection.component';
import { AuthenticatedComponent } from './authenticated.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: 'authenticated',
    component: AuthenticatedComponent
  },
  {
    path: 'boards',
    component: BoardSelectionComponent
  }
];
