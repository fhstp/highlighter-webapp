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

  constructor(private dataStorage: DataStorageService) {}

  ngOnInit() {
    // Combine both observable streams together and wait till both "finished" with zip
    this.tagFilterData = zip(
      this.dataStorage.currentData,
      this.dataStorage.currentColors
    )
      .pipe(
        map(([first, second]) => {
          return {
            searchTerms: first.searchTerms,
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
    this.searchTerms = data.searchTerms;
    this.foundOcc = data.foundOcc;
    this.styleRules = data.styleRules;

    this.rulesClean = this.searchTerms.map(e => {
      const rule = this.styleRules.get('.' + e.toLowerCase());
      return rule;
    });
  }
}
