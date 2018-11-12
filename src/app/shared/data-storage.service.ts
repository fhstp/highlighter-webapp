import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aurum } from './aurum.model';

@Injectable()
export class DataStorageService {

  private defaultData = {
    searchTerms: ['Sample'],
    found_occurences: [{}],
    markupString: ['Example', 'Text', '\n'],
    link: 'www.example.com'
  };

  // Global variable that is used to see if we are in comparsion mode or not
  private _isComparsion: boolean;
  // The search terms of both
  private _searchTermsInput: Array<String>;
  // The set colors and position of rule in stylesheet
  private _currentRules: Map<String, Object>;

  // One input field -- #data1
  private dataStore = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData = this.dataStore.asObservable();

  // The other input field -- #data2
  private dataStore2 = new BehaviorSubject<Aurum>(this.defaultData);
  public readonly currentData2 = this.dataStore2.asObservable();

  /**
   * Just initialize some stuff.
   */
  constructor() {
    this._isComparsion = false;
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
        this.dataStore2.next(message);
        break;
      default:
        break;
    }

    this._searchTermsInput = message.searchTerms;
  }

  /**
 * Getter method for the check if we are in comparsion mode or not.
 */
  get isComparsion(): boolean {
    return this._isComparsion;
  }

  /**
   * Setter method for the check if we are in comparsion mode or not.
   */
  set isComparison(value: boolean) {
    this._isComparsion = value;
  }

  /**
   * Getter method in order to retrieve all the search terms;
   */
  get searchTermsInput(): Array<String> {
    return this._searchTermsInput;
  }

  /**
   * Getter method for retrieving the current set style rules
   */
  get currentStyles(): Map<String, Object> {
    return this._currentRules;
  }

  /**
   * Setter method for the current style rules
   */
  set currentStyles(currStyles: Map<String, Object>) {
    this._currentRules = currStyles;
  }
}
