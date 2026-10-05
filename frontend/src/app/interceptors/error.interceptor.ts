import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

// Shows a message for network and server errors in one place.
// Validation errors (400) are left to the forms that made the request.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        snackBar.open('Cannot reach the server. Is the backend running?', 'Close', { duration: 5000 });
      } else if (error.status >= 500) {
        snackBar.open('Server error. Please try again later.', 'Close', { duration: 5000 });
      }
      return throwError(() => error);
    }),
  );
};
