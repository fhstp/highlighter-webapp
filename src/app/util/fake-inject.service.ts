import { Injectable } from '@angular/core';
import { DataLoadingService } from '../shared/data-loading.service';
import { Aurum } from '../shared/aurum.model';

@Injectable()
export class FakeInjectService {

  constructor(private dataLoading: DataLoadingService) { }

  /**
   * Method is used in order to load the sample data or start the fake injection on the website.
   */
  startInjection() {
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
  private injectFakeData(data: Aurum) {
    // Reference to the input html element
    const element: HTMLElement = document.querySelector('#data1') as HTMLElement;
    // Create event to trigger it as we listen for this in the other component
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    });

    // Perfrom the injection and trigger the event for one input filed only after 2 seconds.
    setTimeout(function () {
      console.log('FROM service | injected the data into the input 1 field');
      element.setAttribute('value', JSON.stringify(data));
      element.dispatchEvent(event);
    }, 2000);
  }

  injectSecondData() {
    const element2: HTMLElement = document.querySelector('#data2') as HTMLElement;
    const sampleData = {
      searchTerms: ['Allgemein', 'Ihnen'],
      found_occurences: [{}],
      markupString: ['Allgemeine Im Folgenden möchten wir Ihnen unsere Allgemeinen Geschäftsbedingungen vorstellen,...'],
      link: 'https://www.zalando.at/zalando-agb/'
    };
    const event = new Event('input', {
      bubbles: true,
      cancelable: true
    });

    element2.setAttribute('value', JSON.stringify(sampleData));
    element2.dispatchEvent(event);
  }
}
