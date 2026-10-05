import { Routes } from '@angular/router';

// loadComponent lazy-loads each page, so its code is downloaded only when the route is first opened
export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', loadComponent: () => import('./pages/task-list/task-list').then((m) => m.TaskList) },
  { path: 'tasks/new', loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm) },
  { path: 'tasks/:id/edit', loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm) },
  { path: 'employees', loadComponent: () => import('./pages/employee-list/employee-list').then((m) => m.EmployeeList) },
  { path: '**', redirectTo: 'tasks' },
];
