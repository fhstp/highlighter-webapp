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
      console.log('%c FROM service | Promise read data',
      'background: #222; color: lightcoral;');

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
      console.log('%c FROM service | injected the sample data into input 1 field',
      'background: #222; color: lightcoral;');
      element.setAttribute('value', JSON.stringify(data));
      element.dispatchEvent(event);
    }, 2000);
  }

  injectSecondData() {
    const element2: HTMLElement = document.querySelector('#data2') as HTMLElement;
    const sampleData = {
      searchTerms: ['Allgemein', 'Ihnen'],
      found_occurences: [{}],
      markupString: [
        'Die',
        'für',
        'die',
        '<span class=\'lieferung\'>Lieferung</span>',
        'anfallenden',
        'Versandkosten',
        'können',
        'unserer',
        'Webseite',
        'entnommen',
        'werden.',
        '(Versandkostentabelle)',
        'Die',
        'Versandkosten',
        'werden',
        'bei',
        'Einleitung',
        'des',
        'Bestellvorgangs',
        'nochmals',
        'mitgeteilt.',
        'Ab',
        'einem',
        'Warenwert',
        'i.H.v.',
        'EUR',
        '50,00',
        'liefern',
        'wir',
        'innerhalb',
        'Deutschlands',
        'versandkostenfrei.', '\n', '\n',
        '4.2', 'Bei', 'Zahlung', 'per', 'Nachnahme', 'werden', 'erhöhte',
        'Versandkosten', '(EUR', '4,00)', 'sowie', 'eine', 'zusätzliche',
        'Gebühr', 'in', 'Höhe', 'von', 'EUR', '2,00', 'fällig,', 'die',
        'der', 'Zusteller', 'vor', 'Ort', 'erhebt.',
        'Weitere', 'Steuern', 'oder', 'Kosten', 'fallen', 'nicht', 'an.',
        '\n', '\n',  'Text', '\n',  'Text', '\n',  'Text', '\n',  'Text',
        '\n', '\n',  '5',
        'Lieferbedingungen',
        'und',
        '<span class=\'lieferung\'>Selbstbelieferungsvorbehalt</span>', '\n',  '5.1',
        'Die',
        '<span class=\'lieferung\'>Lieferung</span>',
        'erfolgt',
        'innerhalb',
        'Deutschlands',
        'mit',
        'DHL',
        'an',
        'Deine',
        'Hausanschrift',
        'oder',
        'an',
        'Packstationen.',
        'Eine',
        'Adressierung',
        'an',
        'Postfächer',
        'bzw.',
        'postlagernde',
        'Sendungen',
        'sind',
        'nicht',
        'möglich.', '\n', '\n',  '5.2',
        'Die',
        'Lieferzeit',
        'beträgt,',
        'sofern',
        'nicht',
        'beim',
        'Angebot',
        'anders',
        'angegeben,',
        '3',
        '–',
        '5',
        'Werktage.',
        'Für',
        'bestimmte',
        'Waren',
        'ist',
        'eine',
        '<span class=\'lieferung\'>Expresslieferung</span>',
        'innerhalb',
        'von',
        '24',
        'Stunden',
        'möglich.',
        'Waren,',
        'für',
        'die',
        'eine',
        '<span class=\'lieferung\'>Expresslieferung</span>',
        'angeboten',
        'wird,',
        'sind',
        'gesondert',
        'gekennzeichnet.', '\n', '\n',  '5.3',
        'Sollten',
        'nicht',
        'alle',
        'bestellten',
        'Produkte',
        'vorrätig',
        'sein,',
        'sind',
        'wir',
        'zu',
        '<span class=\'lieferung\'>Teillieferungen</span>',
        'auf',
        'unsere',
        'Kosten',
        'berechtigt,',
        'soweit',
        'dies',
        'für',
        'Dich',
        'zumutbar',
        'ist.', '\n'],
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
