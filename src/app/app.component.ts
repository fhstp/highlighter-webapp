import { Component } from '@angular/core';
import { DataStorageService } from './shared/data-storage.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ColorGeneratorService } from './shared/color-generator.service';
import { Aurum } from './shared/aurum.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading = false;
  private isNotGenerated = true;

  constructor(private dataStorage: DataStorageService,
    private colorGenerator: ColorGeneratorService,
    private router: Router) {

    /**
     * Check if we are changing the page by listening to the navigation start event.
     * The boolean is used to determine if we are loading or not. We reset the boolean
     * if we are at the end or cancel or error of a navigation.
    */
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.loading = true;
          break;
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.loading = false;
          break;
        default:
          break;
      }
    });
  }

  /**
   * This method is executed once the input arrives in the hidden input fields and sets the
   * data in the data storage according to the input id (data1 or data2) are possible.
   * @param event that is triggered by the user for example
   */
  onInputData(event: any) {
    const data = event.target.value;
    const idOfData = event.target.id;
    const dataParsed: Aurum = JSON.parse(data);

    if (idOfData === 'data1') {
      this.dataStorage.changeData(JSON.parse(data), idOfData);
    }

    // Cheap trick to not use the color generator twice as the attributes are the same for both
    if (this.isNotGenerated) {
      this.colorGenerator.generateStyleRules(dataParsed.searchTerms);
      this.isNotGenerated = false;
    }

    if (idOfData === 'data2') {
      this.dataStorage.changeIsComparison(true);
      this.dataStorage.changeData(JSON.parse(data), idOfData);
    }
  }
}
