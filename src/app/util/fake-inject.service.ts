import { Injectable } from '@angular/core';
import { DataLoadingService } from '../shared/data-loading.service';
import { Aurum } from '../shared/aurum.model';

@Injectable()
export class FakeInjectService {

  constructor(private dataLoading: DataLoadingService) {
    // Read it for convenience as PROMISE
    this.dataLoading.readLocalDataP().then(data => {
      console.log('FROM service | Promise read data');

      this.injectFakeData(data);
    });
  }

  /**
   * This method is used to generate a fake injection of the browser extension.
   * @param data we previously load form a local file using another service
   */
  injectFakeData(data: Aurum) {
    // Reference to the input html elements
    const element: HTMLElement = document.querySelector('#data1') as HTMLElement;
    const element2: HTMLElement = document.querySelector('#data2') as HTMLElement;
    // Create event to trigger it as we listen for this in the other component
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    });

    // Perfrom the injection and trigger the events for both input fields
    setTimeout(function () {
      console.log('FROM service | injected the data into the input 1 and 2 fields')
      element.setAttribute('value', JSON.stringify(data));
      element.dispatchEvent(event);

      element2.setAttribute('value', JSON.stringify(data));
      element2.dispatchEvent(event);
    }, 2000);
  }
}
