import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../util/modal.service';
import { take } from 'rxjs/operators';
import { FakeInjectService } from '../../util/fake-inject.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  confirmResult: boolean;
  inputResult: string;
  messageResult: boolean;

  constructor(private fakeInject: FakeInjectService,
              private modalService: ModalService) { }

  ngOnInit() {
    console.log('%c FROM component | Initizalized it...',
    'background: #222; color: orange;');
  }

  /**
   * We are using the .take() operator here in order to directly unsubscribe after the first value is
   * recived and close the stream.
   */
  openConfirm() {
    this.modalService.confirm('Alles klar?', 'Frage')
      .pipe(take(1))
      .subscribe(result => {
        this.confirmResult = result;
      });
  }

  openInput() {
    this.modalService.input('Wie findest du dieses Tool (1-Super -- 5-Geht so)?', '1', 'Frage')
      .pipe(take(1))
      .subscribe(result => {
        this.inputResult = result;
      });
  }

  openMessage() {
    this.modalService.message('Willkommen bei der Highlighter Web App!!', 'Information')
      .pipe(take(1))
      .subscribe(result => {
        this.messageResult = result;
      });
  }

  useSampleData() {
    this.fakeInject.startInjection();
  }

  useSecondData() {
    this.fakeInject.injectSecondData();
  }
}
