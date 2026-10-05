import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

// DRF returns validation errors as { field: ["message"] }.
// Puts each message on the matching form control (as a 'server' error)
// and returns a message for anything that doesn't belong to a field.
export function applyServerErrors(form: FormGroup, error: HttpErrorResponse): string {
  if (error.status !== 400 || typeof error.error !== 'object' || error.error === null) {
    return 'Something went wrong. Please try again.';
  }

  const otherMessages: string[] = [];
  for (const [field, value] of Object.entries(error.error)) {
    const message = Array.isArray(value) ? value.join(' ') : String(value);
    const control = form.get(field);
    if (control) {
      control.setErrors({ server: message });
      control.markAsTouched();
    } else {
      otherMessages.push(message);
    }
  }
  return otherMessages.length ? otherMessages.join(' ') : 'Please fix the errors below.';
}
