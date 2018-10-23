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

  // Global variable that is used to see if we are in comparsion mode or not
  private _isComparsion: boolean;

  // One input field
  private dataStore = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData = this.dataStore.asObservable();

  // The other input field
  private dataStore2 = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData2 = this.dataStore2.asObservable();

  /**
   * Just initialize some stuff.
   */
  constructor() {
    this._isComparsion = false;
  }

  /**
   * Getter method for the check if we are in comparsion method or not.
   */
  get isComparsion(): boolean {
    return this._isComparsion;
  }

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
        this._isComparsion = true;
        this.dataStore2.next(message);
        break;
      default:
        break;
    }
  }
}
