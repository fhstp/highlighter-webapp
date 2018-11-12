import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Aurum } from '../../shared/aurum.model';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VizComponent implements OnInit {

  private storedData: Aurum;
  private storedData2: Aurum;

  isComparison: boolean;
  firstWebsiteName: string;
  secondWebsiteName: string;

  @ViewChild('dataContainer') dataContainer: ElementRef;
  @ViewChild('dataContainer2') dataContainer2: ElementRef;

  constructor(private dataStorage: DataStorageService) { }

  /**
   * Here we subscribe to the data storage service which is essential in order to
   * retrieve the data upon arrival.
   */
  ngOnInit() {
    // Check if we are in comparison mode or not
    this.isComparison = this.dataStorage.isComparsion;

    // TODO: Add maybe take(1) as we only need the values once anc can unsubscribe later
    this.dataStorage.currentData.subscribe((data) => {
      console.log('%c TRIGGERED | first data storage... observable',
      'background: #222; color: aquamarine;');

      this.storedData = data;
      this.renderText(this.storedData);
    });

    // We need to subscribe only if its a comparison
    if (this.isComparison) {
      this.dataStorage.currentData2.subscribe((data) => {
        console.log('%c TRIGGERED | second data storage... observable',
        'background: #222; color: aquamarine;');

        this.storedData2 = data;
        this.renderSecondText(this.storedData2);
      });
    }
  }

  /**
   * This method is currently used to render just the received data and show it on the screen.
   * @param data to show to the user
   */
  private renderText(data: Aurum) {
    console.log('%c FROM component | Inside renderText() function (ONE INPUT).',
    'background: #222; color: orange;');

    this.firstWebsiteName = data.link;
    const stringToPrint = data.markupString.join(' ');
    this.dataContainer.nativeElement.innerHTML = stringToPrint;
  }

  /**
   * This method is only used if we are in comparison mode.
   * @param data to show in the second input
   */
  private renderSecondText(data: Aurum) {
    console.log('%c FROM component | Inside renderSecondText() function (TWO INPUTS)',
    'background: #222; color: orange;');

    this.secondWebsiteName = data.link;
    const stringToPrint = data.markupString.join(' ');
    this.dataContainer2.nativeElement.innerHTML = stringToPrint;
  }
}
