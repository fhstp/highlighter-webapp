import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {

  combinedObservables: any;
  searchTerms: string[];
  foundOcc: Object[];
  styleRules: Map<string, string>;

  // Desired structure is ready
  tagFilterData: any;
  // Terms that are selected
  termsSelected: any;

  constructor(private dataStorage: DataStorageService) { }

  ngOnInit() {
    // Combine both observable streams together and wait till both "finished" with zip
    this.combinedObservables = zip(
      this.dataStorage.currentData,
      this.dataStorage.currentColors,
      this.dataStorage.searchTerms
    ).pipe(
      map(([first, second, third]) => {
        return {
          searchTerms: third,
          foundOcc: first.found_occurences,
          styleRules: second
        };
      })
    )
      .subscribe(data => {
        this.assembleTags(data);
      });
  }

  assembleTags(data: any) {
    // Object containing all main categories and their sub categories as array
    const searchTerms = data.searchTerms;
    // Used to extract the tags and their colors as array of 2 values
    const arrayOfColors = [];

    // Store some properties global
    // this.searchTerms = data.searchTerms;
    this.foundOcc = data.foundOcc;
    this.styleRules = data.styleRules;

    // 1) Extract the main categories from the search terms property
    let mainCategories: Array<string>;
    mainCategories = Object.keys(searchTerms);

    // 2) Create and array of objects where each has the key as the main category and the colors
    this.styleRules.forEach(function (value, key) {
      const color = {};
      color[key] = [...value.split('|')];
      arrayOfColors.push(color);
    }, this.styleRules);

    // 3) Iterate over each main categorie and its sub categories and build the rewuired structure
    const result = [];
    const selected = [];

    mainCategories.forEach((crit, idx) => {
      // Crit as class name
      const critClass = '.' + crit.toLowerCase();
      const mainCrit = {};

      // Get the current color for each class from the colors array
      const critColors = arrayOfColors.find(v => v[critClass]);
      // The name property
      mainCrit['name'] = crit;
      // The color property is first in array
      mainCrit['color'] = critColors[critClass][0];
      // The font color property is second in array
      mainCrit['fontC'] = critColors[critClass][1];
      // The group property for the main categories is the same as crit
      mainCrit['group'] = searchTerms[crit] !== undefined ? crit : 'Andere';
      // The occ not read yet so all is 1
      mainCrit['occ'] = 1;
      // The boolean is true as we are in main categorie now
      mainCrit['isMain'] = true;

      result.push(mainCrit);
      selected.push(crit);

      // Add Sub Criterias if we have some
      if (searchTerms[crit] !== undefined) {
        const currentSubCrits = searchTerms[crit];
        currentSubCrits.forEach((sCrit) => {
          const subCrit = {};
          subCrit['name'] = sCrit;
          subCrit['color'] = critColors[critClass][0];
          subCrit['fontC'] = critColors[critClass][1];
          subCrit['group'] = crit;
          subCrit['occ'] = 1;
          subCrit['isMain'] = false;

          result.push(subCrit);
          selected.push(sCrit);
        });
      }
    });

    this.tagFilterData = result;
    this.termsSelected = selected;
    // console.log('search terms: ', searchTerms, ' main categories: ', mainCategories,
    // 'occurences: ', this.foundOcc, ' style rules: ', this.styleRules);
    // console.log(arrayOfColors);
  }

  /**
   * Executes on adding an elment to the selected list
   * @param $event is the object we currently add
   */
  onAdd($event) {
    console.log('Added: ', $event);
  }

  /**
   * Executes on removing an element from the selected list
   * @param $event is the object we currently remove
   */
  onRemove($event) {
    console.log('Removed: ', $event);
  }

  /**
   * Method is called once all tags are removed from the selected list.
   * If this is called then no entries are selected.
   */
  onClear() {
    console.log('All removed');
  }

  /**
   * This is a workaround for the knwon template defined method bug.
   * https://github.com/angular/angular/issues/16643
   * @param callback Method to call or trigger
   * @param args Arguments of the method to call
   */
  trigger(callback, ...args) {
    return callback(...args);
  }
}
