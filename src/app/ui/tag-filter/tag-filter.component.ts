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

  tagFilterData: any;
  searchTerms: string[];
  foundOcc: Object[];
  styleRules: Map<string, string>;

  rulesClean: string[];

  // This is the desired structure...
  finalTerms: any;
  termsSelected: any;

  constructor(private dataStorage: DataStorageService) {
    // Just filling the desired structure and build it later on...
    this.finalTerms = [
      {
        name: 'Garantie',
        color: 'rgb(157, 18, 186)',
        fontC: 'rgb(255, 255, 255)',
        group: 'Garantie',
        occ: 7,
        isMain: true
      },
      {
        name: 'Mangel',
        color: 'rgb(157, 18, 186)',
        fontC: 'rgb(255, 255, 255)',
        group: 'Garantie',
        occ: 2,
        isMain: false
      },
      {
        name: 'Gewähr',
        color: 'rgb(157, 18, 186)',
        fontC: 'rgb(255, 255, 255)',
        group: 'Garantie',
        occ: 15,
        isMain: false
      },
      {
        name: 'Gewährleistung',
        color: 'rgb(157, 18, 186)',
        fontC: 'rgb(255, 255, 255)',
        group: 'Garantie',
        occ: 3,
        isMain: false
      },
      {
        name: 'Umtausch',
        color: 'rgb(244, 199, 65)',
        fontC: 'rgb(0, 0, 0)',
        group: 'Umtausch',
        occ: 3,
        isMain: false
      },
      {
        name: 'Mangel',
        color: 'rgb(244, 199, 65)',
        fontC: 'rgb(0, 0, 0)',
        group: 'Umtausch',
        occ: 3,
        isMain: false
      },
      {
        name: 'Beschädigung',
        color: 'rgb(244, 199, 65)',
        fontC: 'rgb(0, 0, 0)',
        group: 'Umtausch',
        occ: 3,
        isMain: false
      },
      {
        name: 'test',
        color: 'rgb(199, 255, 33)',
        fontC: 'rgb(0, 0, 0)',
        group: 'Andere',
        occ: 2,
        isMain: true
      },
      {
        name: 'paypal',
        color: 'rgb(65, 244, 193)',
        fontC: 'rgb(0, 0, 0)',
        group: 'Andere',
        occ: 2,
        isMain: true
      }
    ];
  }

  ngOnInit() {
    // Combine both observable streams together and wait till both "finished" with zip
    this.tagFilterData = zip(
      this.dataStorage.currentData,
      this.dataStorage.currentColors,
      this.dataStorage.searchTerms
    )
      .pipe(
        map(([first, second, third]) => {
          console.log('all: ', first, second, third);
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

    // First extract the main categories from the search terms property
    let mainCategories: Array<string>;
    mainCategories = Object.keys(searchTerms);

    // this.searchTerms = data.searchTerms;
    this.foundOcc = data.foundOcc;
    this.styleRules = data.styleRules;

    // this.rulesClean = this.searchTerms.map(e => {
    //   const rule = this.styleRules.get('.' + e.toLowerCase());
    //   return rule;
    // });
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
}
