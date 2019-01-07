import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import Helper from '../util/helper';
import criteriasConfig from '../../assets/criterias.json';

@Injectable({
  providedIn: 'root'
})
export class ColorGeneratorService {

  constructor(private dataStorage: DataStorageService) { }

  private styleSheet;
  private currentRules = new Map();
  private currentColors = new Map();
  private criteriasArray: Array<string>;
  private nColors: number;

  generateStyleRules(searchTerms?: Array<string>) {
    // Used to store the search terms later and sub categories
    const terms = {};

    // Cretae the empty stylesheet
    this.createStylesheet();
    // Get the criterias now
    if (searchTerms) {
      this.criteriasArray = searchTerms;
    } else {
      this.criteriasArray = this.dataStorage.searchTermsInput;
    }

    const cleaned = this.cleanCriterias();
    this.nColors = cleaned.length;

    // Generate the random colors next and the styles for each
    const startColor = Math.random();
    cleaned.forEach((crit, i) => {
      // Add the main rule:
      const rgb = Helper.HSVtoRGB(startColor + (1 / this.nColors * i), 0.7, 1);
      const fontColor = Helper.getFontColorFromRGB(rgb);

      this.addRule(`.${crit.toLowerCase()}`,
        `background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});
        color: ${fontColor};`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `${fontColor}`);

      // add CSS for overview rects
      this.addRule(`.textOverview rect.${crit.toLowerCase()}`,
        `fill: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

      // Add the sub rules if present
      const currentCritSubCat = criteriasConfig[crit];
      if (currentCritSubCat !== undefined) {
        currentCritSubCat.forEach((el) => {
          this.addRule(`.${el.toLowerCase()}`,
            `background-color:  rgb(${rgb.r}, ${rgb.g}, ${rgb.b});
            color: ${fontColor}`);
          this.addRule(`.textOverview rect.${el.toLowerCase()}`,
            `fill: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        });
      }

      // Save the terms and subcategories for later use
      terms[crit] = criteriasConfig[crit];
    });

    // Store the rules we created globally as well as the search terms
    this.dataStorage.currentStyles = this.currentRules;
    this.dataStorage.changeSearchTerms(terms);

    // Store the colors only if we have some
    if (this.currentColors.size > 0) {
      this.dataStorage.changeCurrentColors(this.currentColors);
    }
  }

  /**
   * This method creates an empty stlyesheet where we then can add our rules.
   */
  private createStylesheet() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.styleSheet = style.sheet;
  }

  /**
   * This method is used to add a style rule to our stylesheet and stores the reference
   * to the created rule. Example: addRule('p', 'color: black;');
   * The rules are store in a map with their postion in the styleSheet as index.
   * Furthermore the color is stored if given in a seperate map..
   * @param selector of the rule to add
   * @param rule we want to add as string
   */
  private addRule(selector: string, rule: string, color?: string, fontC?: string) {
    const storeRule = this.styleSheet.insertRule(selector + '{' + rule + '}',
      this.currentRules.size);
    this.currentRules.set(selector, {
      'posStylesheet': storeRule,
      'color': rule
    });

    if (color && fontC) {
      this.currentColors.set(selector, color + '|' + fontC);
    }
  }

  /**
   * This method removes all rules we created.
   */
  private removeAllRules() {
    const len = this.styleSheet.rules.length;
    for (let i = 0; i < len ; i++) {
      this.styleSheet.deleteRule(0);
    }
  }

  /**
   * This method is used to clean the one dimensional array of search terms and categorize it
   * between main criterias and sub criterias as well self defined ones.
   */
  private cleanCriterias(): Array<string> {
    const allCriterias = [];
    const selfCreatedCriterias = [];
    const sentOfficialCriterias = [];
    const indexToKeep = [];
    let criteriasToKeep = [];
    const cleanedCriterias = [];

    const criterias = this.criteriasArray;
    const categories = Object.keys(criteriasConfig).slice(1);

    // 1: Read the criterias json and make just one array out of it.
    categories.forEach((cat) => {
      allCriterias.push(cat, ...criteriasConfig[cat]);
    });

    // 2: Store the self created criterias seperatly to later attach them
    criterias.forEach((crit) => {
      if (allCriterias.indexOf(crit) === -1) {
        selfCreatedCriterias.push(crit);
      } else {
        sentOfficialCriterias.push(crit);
      }
    });

    // 3: From the official criterias we remove now the ones that are not in our stream
    for (let i = 0; i < categories.length; i++) {
      // Store the current crit we have
      const currentCrit = categories[i];
      const indexPos = sentOfficialCriterias.indexOf(currentCrit);
      if (indexPos > -1) {
        const nrOfCrit = criteriasConfig[categories[i]].length;
        // This makes sure that we only get main categories
        if (sentOfficialCriterias[indexPos + nrOfCrit] !== undefined) {
          indexToKeep.push(indexPos);
        }
      }
    }

    // 4: Find now all the criterias we need to keep
    criteriasToKeep = sentOfficialCriterias.filter((item, index) => {
      if (indexToKeep.indexOf(index) !== -1) {
        return true;
      }
    });

    // 5: Finally combine the main criterias and self created ones
    cleanedCriterias.push(...criteriasToKeep, ...selfCreatedCriterias);

    return cleanedCriterias;
    // console.log('Received criterias: ', criterias,
    // ' All Criterias: ', allCriterias,
    // ' Self Created Criterias: ', selfCreatedCriterias,
    // ' Official Criterias: ', sentOfficialCriterias,
    // ' Criterias to keep (main categories): ', indexToKeep,
    // ' Criterias to remove: ', criteriasToKeep,
    // ' Main criterias we use: ', sentMainCriterias,
    // ' Cleaned criterias array: ', cleanedCriterias);
  }
}
