export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

export interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string; // YYYY-MM-DD
  created_at: string;
}

// Fields sent to the API when creating or updating a task
export type TaskPayload = Pick<Task, 'title' | 'description' | 'assigned_to' | 'priority' | 'status' | 'due_date'>;

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
}
