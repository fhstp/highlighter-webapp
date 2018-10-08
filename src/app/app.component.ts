import { Component } from '@angular/core';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private dataStorage: DataStorageService) { }

  /**
   * This method is executed once the inpu arrives in the hidden input fields and sets the
   * data in the data storage according to the input id (data1 or data2) are possible.
   * @param event that is triggered by the user for example
   */
  onInputData(event: any) {
    const data = event.target.value;
    const idOfData = event.target.id;

    console.log('READ from ', idOfData, ' input field with data: ', data);

    this.dataStorage.changeData(JSON.parse(data), idOfData);
  }
}
