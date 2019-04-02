import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * This component is used to create a simple message dialog.
 * It's fully customizeable and part of the modal service. Furthermore there are two parameters
 * that can be changed. The OnPush change detection is used in order to
 * register the change only if triggered and not automatically look for it.
 * Source: https://blog.oasisdigital.com/2018/writing-a-generic-type-safe-ng-bootstrap-ngbmodal-launcher/
 */
@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageDialogComponent {

  title: string;
  message: string;

  constructor(public activeModal: NgbActiveModal) { }
}
