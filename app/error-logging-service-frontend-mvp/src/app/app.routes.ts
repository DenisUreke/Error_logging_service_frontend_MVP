import { Routes } from '@angular/router';

import { ServerStatusPage } from './pages/server-status/server-status.page';
import { UsersPage } from './pages/users/users.page';
import { LogsPage } from './pages/logs/logs.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'server-status' },
  { path: 'server-status', component: ServerStatusPage },
  { path: 'users', component: UsersPage },
  { path: 'logs', component: LogsPage },
  { path: '**', redirectTo: 'server-status' },
];
