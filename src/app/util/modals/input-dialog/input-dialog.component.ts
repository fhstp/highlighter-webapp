import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * This component is used to create a input dialog where the user hast to enter something.
 * It's fully customizeable and part of the modal service. Furthermore there are three parameters
 * that can be changed. The OnPush change detection is used in order to
 * register the change only if triggered and not automatically look for it.
 * Source: https://blog.oasisdigital.com/2018/writing-a-generic-type-safe-ng-bootstrap-ngbmodal-launcher/
 */
@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDialogComponent {

  title: string;
  message: string;
  input = new FormControl('', Validators.required);

  constructor(public activeModal: NgbActiveModal) { }

  set initialValue(value: string) {
    this.input.setValue(value);
  }
}
