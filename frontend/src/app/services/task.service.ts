import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Task, TaskFilters, TaskPayload } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/tasks/`;

  getAll(filters: TaskFilters = {}) {
    // Only send filters that have a value, e.g. ?status=Pending&search=report
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }
    return this.http.get<Task[]>(this.url, { params });
  }

  get(id: number) {
    return this.http.get<Task>(`${this.url}${id}/`);
  }

  create(task: TaskPayload) {
    return this.http.post<Task>(this.url, task);
  }

  update(id: number, task: TaskPayload) {
    return this.http.put<Task>(`${this.url}${id}/`, task);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
