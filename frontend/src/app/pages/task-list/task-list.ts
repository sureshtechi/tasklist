import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';

import { TASK_PRIORITIES, TASK_STATUSES, Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly columns = ['title', 'employee', 'priority', 'status', 'due_date', 'action'];

  filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
    priority: new FormControl('', { nonNullable: true }),
  });

  tasks = signal<Task[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    // Reload whenever a filter changes; the debounce avoids a request per keystroke
    this.filters.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => this.loadTasks());
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.taskService.getAll(this.filters.getRawValue()).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load tasks.');
        this.loading.set(false);
      },
    });
  }

  clearFilters() {
    this.filters.reset();
  }

  deleteTask(task: Task) {
    if (!confirm(`Delete task "${task.title}"?`)) {
      return;
    }
    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.snackBar.open('Task deleted.', 'Close', { duration: 3000 });
        this.loadTasks();
      },
      error: () => this.errorMessage.set(`Could not delete "${task.title}".`),
    });
  }
}
