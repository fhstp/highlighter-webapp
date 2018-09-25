import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aurum } from './aurum.model';

@Injectable()
export class DataStorageService {

  private defaultData = {
    found_occurences: [{}],
    markupString: ['Example Text'],
    link: 'www.example.com'
  };

  // One input field
  private dataStore = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData = this.dataStore.asObservable();

  // The other input field
  private dataStore2 = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData2 = this.dataStore2.asObservable();

  /**
   * This method is used to save the data in the respective store and notify all subscribed
   * components about it. Then the components can use the newly arrived data.
   * @param message is the data that will be stored in our data storage service
   * @param id is the type of input (either data1 or data2) to distinguish between comparisons
   */
  changeData(message: any, id: string) {
    switch (id) {
      case 'data1':
        this.dataStore.next(message);
        break;
      case 'data2':
        this.dataStore2.next(message);
        break;
      default:
        break;
    }
  }
}
