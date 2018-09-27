import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * This component is used to create a confirm dialog where the user hast to confirm something.
 * It's fully customizeable and part of the modal service. Furthermore there are two parameters
 * that can be changed depending on the input. The OnPush change detection is used in order to
 * register the change only if triggered and not automatically look for it.
 * Source: https://blog.oasisdigital.com/2018/writing-a-generic-type-safe-ng-bootstrap-ngbmodal-launcher/
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {

  title: string;
  prompt: string;

  constructor(public activeModal: NgbActiveModal) { }
}
