import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aurum } from './aurum.model';

@Injectable()
export class DataStorageService {

  private defaultData = {
    searchTerms: ['Sample'],
    found_occurences: [{}],
    markupString: ['Example', 'Text', '\n', 'With', 'some', 'sample', 'Text.'],
    link: 'www.example.com'
  };

  private defaultColor = new Map([['sample', 'rgb(200, 74, 12)'], ['test', 'rgb(220, 82, 110)']]);
  private defaultComparison = false;

  // Global variable that is used to see if we are in comparsion mode or not
  private _isComparsion = new BehaviorSubject<boolean>(this.defaultComparison);
  public readonly isComparison = this._isComparsion.asObservable();

  // The search terms of both
  private _searchTermsInput: Array<String>;
  // The set colors and position of rule in stylesheet
  private _currentRules: Map<String, Object>;
  // The current colors as Observable as we need it at creation time
  private _currentColors = new BehaviorSubject<Map<string, string>>(this.defaultColor);
  public readonly currentColors = this._currentColors.asObservable();

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
   * This method is used in order to add new colors to the observable stream. We need
   * this as observable stream as we are using the colors at the creation time already.
   * @param color is a map with the tag as key and it's color as value
   */
  changeCurrentColors(color: Map<string, string>) {
    this._currentColors.next(color);
  }

  changeIsComparison(state: boolean) {
    this._isComparsion.next(state);
  }
//   /**
//  * Getter method for the check if we are in comparsion mode or not.
//  */
//   get isComparsion(): boolean {
//     return this._isComparsion;
//   }

//   /**
//    * Setter method for the check if we are in comparsion mode or not.
//    */
//   set isComparison(value: boolean) {
//     this._isComparsion = value;
//   }

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
