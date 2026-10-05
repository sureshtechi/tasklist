import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { Employee } from '../models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/employees/`;

  getAll() {
    return this.http.get<Employee[]>(this.url);
  }

  get(id: number) {
    return this.http.get<Employee>(`${this.url}${id}/`);
  }

  create(employee: Omit<Employee, 'id'>) {
    return this.http.post<Employee>(this.url, employee);
  }

  update(id: number, employee: Omit<Employee, 'id'>) {
    return this.http.put<Employee>(`${this.url}${id}/`, employee);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
