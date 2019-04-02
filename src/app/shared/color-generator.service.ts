import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import Helper from '../util/helper';
import criteriasConfig from '../../assets/criterias.json';
import { Style } from './style.model';

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

  private originalRules = [];
  private orignalRulesTextO = [];

  /**
   * This method is the initial method which creates the master set of style rules.
   * @param searchTerms to generate style rules for
   */
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

      this.originalRules.push({
        'selector': `.${crit.toLowerCase()}`,
        'rule':  `background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}); color: ${fontColor};`,
        'color': `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        'fontC': `${fontColor}`
      });
      this.orignalRulesTextO.push({
        'selector': `.textOverview rect.${crit.toLowerCase()}`,
        'rule':  `fill: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      });

      // Add the sub rules if present
      const currentCritSubCat = criteriasConfig[crit];
      if (currentCritSubCat !== undefined) {
        currentCritSubCat.forEach((el) => {
          this.originalRules.push({
            'selector': `.${el.toLowerCase()}`,
            'rule':  `background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}); color: ${fontColor};`,
            'color': `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            'fontC': `${fontColor}`
          });
          this.orignalRulesTextO.push({
            'selector': `.textOverview rect.${el.toLowerCase()}`,
            'rule':  `fill: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
          });
        });
      }

      // First create all rules that we passed
      this.addRulesToStylesheet(this.originalRules, this.orignalRulesTextO);
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

  alterStyleRules(currentTerms: Array<string>) {
    // 1) We need to convert the terms to selectors
    const cT = currentTerms.map(el => '.' + el.toLowerCase());
    const cTfO = currentTerms.map(elm => '.textOverview rect.' + elm.toLowerCase());
    // 2) Take only those from the original ones we want to display
    const rulesText = this.originalRules.filter(item => cT.includes(item.selector));
    const rulesOverview = this.orignalRulesTextO.filter(item => cTfO.includes(item.selector));
    // 3) Remove all the rules first off
    this.removeAllRules();
    this.removeVariables();
    // 4) Add those we need finally
    this.addRulesToStylesheet(rulesText, rulesOverview);
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
   * This method is used in order to add all style rules for the text and overview to
   * the stylesheet.
   * @param rules is the array of objects for normal text
   * @param rulesOverview is the array of objects for the text overview.
   */
  private addRulesToStylesheet(rules: Array<Style>, rulesOverview: Array<Style>) {
    rules.forEach(el => {
      this.addRule(el.selector, el.rule, el.color, el.fontC);
    });

    rulesOverview.forEach(elm => {
      this.addRule(elm.selector, elm.rule);
    });
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
   * This method is used in order to clean all the current variables.
   */
  private removeVariables() {
    this.currentRules = new Map();
    this.currentColors = new Map();
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
