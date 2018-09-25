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
  firstWebsiteName: string;
  @ViewChild('dataContainer') dataContainer: ElementRef;

  constructor(private dataStorage: DataStorageService) { }

  /**
   * Here we subscribe to the data storage service which is essential in order to
   * retrieve the data upon arrival.
   */
  ngOnInit() {
    this.dataStorage.currentData.subscribe((data) => {
      this.storedData = data;
      this.renderText(this.storedData);
    });
  }

  /**
   * This method is currently used to render just the received data and show it on the screen.
   * @param data to show to the user
   */
  private renderText(data: Aurum) {
    console.log('FROM component | Inside renderText() function: ', data);

    this.firstWebsiteName = data.link;

    const stringToPrint = data.markupString.join(' ');
    this.dataContainer.nativeElement.innerHTML = stringToPrint;
  }
}
