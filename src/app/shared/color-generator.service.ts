import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ColorGeneratorService {

  constructor(private dataStorage: DataStorageService) { }

  private styleSheet;
  private currentRules = new Map();

  generateStyleRules(type: string) {
    this.createStylesheet();

    if (type === 'data1') {
    } else if (type === 'data2') {
      console.log('Generate Styles for 2');
    } else {
      console.log('Do nothing');
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
   * @param selector of the rule to add
   * @param rule we want to add as string
   */
  private addRule(selector: string, rule: string) {
    const storeRule = this.styleSheet.insertRule(selector + '{' + rule + '}',
      this.currentRules.size);
    this.currentRules.set(selector, storeRule);
  }

  /**
   * This method removes all rules we created.
   */
  private removeAllRules() {
    for (let i = 0; i < this.styleSheet.rules.length; i++) {
      this.styleSheet.removeRule(i);
    }
  }
}
