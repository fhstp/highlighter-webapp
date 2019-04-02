import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './modals/input-dialog/input-dialog.component';
import { MessageDialogComponent } from 'src/app/util/modals/message-dialog/message-dialog.component';

/**
 * This class is the modal service which offers the various methods for creating dialogs.
 * The dialogs have default properties and are returned asynchronously. We are returning them
 * as observable that is created out of the promise that comes from the modal itself when it's closed.
 * We are using the .pipe() method of Observables to chain several other rxjs operators together in a sequence.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private ngbModal: NgbModal) {}

  /**
   * Creates a confirm dialog that has some default parameters and returns an observable
   * we can subscribe to. If the creation or anyhting fails we return nothing.
   * @param prompt we want to ask the user
   * @param title of the dialog
   */
  confirm(prompt = 'Really?', title = 'Confirm'): Observable<boolean> {
    const modal = this.ngbModal.open(ConfirmDialogComponent, { backdrop: 'static' });
    modal.componentInstance.prompt = prompt;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  /**
   * Creates a input dialog that has a default title and returns the result as an observable.
   * @param message to display
   * @param initialValue of the input
   * @param title of the dialog
   */
  input(message: string, initialValue: string, title = 'Input'): Observable<string> {
    const modal = this.ngbModal.open(InputDialogComponent, { backdrop: 'static' });
    modal.componentInstance.message = message;
    modal.componentInstance.initialValue = initialValue;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  /**
   * Creates a simple message dialog that shows the specified message to the user and returns
   * an observable.
   * @param message to display for the user
   * @param title of the dialog
   */
  message(message: string, title = 'Message'): Observable<boolean> {
    const modal = this.ngbModal.open(MessageDialogComponent, { backdrop: 'static' });
    modal.componentInstance.message = message;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }
}
