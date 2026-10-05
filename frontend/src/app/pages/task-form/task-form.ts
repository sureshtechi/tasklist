import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Employee } from '../../models/employee';
import { TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskStatus } from '../../models/task';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';
import { applyServerErrors } from '../../utils/server-errors';

// Today's date as YYYY-MM-DD in local time (toISOString would give the UTC date)
function todayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// YYYY-MM-DD strings compare correctly as plain strings
function notInPast(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value < todayString() ? { pastDate: true } : null;
}

const REQUIRED_MESSAGES: Record<string, string> = {
  title: 'Title is required.',
  assigned_to: 'Please select an employee.',
  priority: 'Please select a priority.',
  status: 'Please select a status.',
  due_date: 'Due date is required.',
};

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  // Set on /tasks/:id/edit, null on /tasks/new
  readonly taskId = Number(this.route.snapshot.paramMap.get('id')) || null;
  readonly minDueDate = this.taskId ? '' : todayString();

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description: new FormControl('', { nonNullable: true }),
    assigned_to: new FormControl<number | null>(null, Validators.required),
    priority: new FormControl<TaskPriority>('Medium', { nonNullable: true, validators: Validators.required }),
    status: new FormControl<TaskStatus>('Pending', { nonNullable: true, validators: Validators.required }),
    due_date: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  employees = signal<Employee[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.employeeService.getAll().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.errorMessage.set('Could not load employees.'),
    });

    if (this.taskId) {
      this.loadTask(this.taskId);
    } else {
      // Business rule: a new task cannot be due in the past
      this.form.controls.due_date.addValidators(notInPast);
    }
  }

  private loadTask(id: number) {
    this.loading.set(true);
    this.taskService.get(id).subscribe({
      next: (task) => {
        this.form.patchValue(task);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load the task.');
        this.loading.set(false);
      },
    });
  }

  // First error message for a field, shown in its <mat-error>
  fieldError(name: keyof typeof this.form.controls): string {
    const control = this.form.controls[name];
    if (control.hasError('required')) return REQUIRED_MESSAGES[name];
    if (control.hasError('maxlength')) return 'Title must be at most 200 characters.';
    if (control.hasError('pastDate')) return 'Due date cannot be in the past.';
    return control.getError('server') ?? '';
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    const task = this.form.getRawValue();
    const request = this.taskId ? this.taskService.update(this.taskId, task) : this.taskService.create(task);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.taskId ? 'Task updated.' : 'Task created.', 'Close', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(applyServerErrors(this.form, error));
        this.saving.set(false);
      },
    });
  }
}
