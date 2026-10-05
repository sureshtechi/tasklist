import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  columns = ['name', 'email', 'action'];

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load employees.');
        this.loading.set(false);
      },
    });
  }

  deleteEmployee(employee: Employee) {
    if (!confirm(`Delete ${employee.name}?`)) {
      return;
    }
    this.employeeService.delete(employee.id).subscribe({
      next: () => this.loadEmployees(),
      error: () => this.errorMessage.set(`Could not delete ${employee.name}.`),
    });
  }
}
