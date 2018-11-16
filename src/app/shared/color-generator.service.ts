import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ColorGeneratorService {

  constructor(private dataStorage: DataStorageService) { }

  private styleSheet;
  private currentRules = new Map();
  private criteriasArray: Array<String>;
  private nColors: number;

  generateStyleRules() {
    // Cretae the empty stylesheet
    this.createStylesheet();
    // Get the criterias now
    this.criteriasArray = this.dataStorage.searchTermsInput;
    this.nColors = this.criteriasArray.length;

    // Generate the random colors next and the styles for each
    const startColor = Math.random();
    this.criteriasArray.forEach((crit, i) => {
      const rgb = this.HSVtoRGB(startColor + (1 / this.nColors * i), 0.7, 1);
      this.addRule(`.${crit.toLowerCase()}`,
        `background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    });

    // Store the rules we created globally
    this.dataStorage.changeCurrentRules(this.currentRules);
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
   * The colors are stored in a map with their postion in the styleSheet as index.
   * @param selector of the rule to add
   * @param rule we want to add as string
   */
  private addRule(selector: string, rule: string, color: string) {
    const storeRule = this.styleSheet.insertRule(selector + '{' + rule + '}',
      this.currentRules.size);
    this.currentRules.set(selector, color);
  }

  /**
   * This method removes all rules we created.
   */
  private removeAllRules() {
    for (let i = 0; i < this.styleSheet.rules.length; i++) {
      this.styleSheet.removeRule(i);
    }
  }

  /**
   * This method is used in order transform an hsv value to a rgb value.
   * @param h hue
   * @param s saturation
   * @param v value
   * @returns RGB object with 3 keys (r, g, b) and their values
   */
  private HSVtoRGB(h, s, v): {r: number, g: number, b: number} {
    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
}
