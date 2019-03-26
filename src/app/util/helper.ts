export default class Helper {
  /**
  * This method is used in order transform an hsv value to a rgb value.
  * @param h hue
  * @param s saturation
  * @param v value
  * @returns RGB object with 3 keys (r, g, b) and their values
  */
  static HSVtoRGB(h, s, v): { r: number, g: number, b: number } {
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

  /**
 * This method is based on: https://stackoverflow.com/a/43521261/4807354
 * and calculates the luminance of the given rgb color. Based on this the
 * font color is changed to black or white.
 * @param rgb color to calculate the luminance from
 */
  static getFontColorFromRGB(rgb: { r: number, g: number, b: number }) {
    const black = 'rgb(0, 0, 0)';
    const white = 'rgb(255, 255, 255)';

    const luminance = Math.sqrt(0.241
      * Math.pow(rgb.r, 2) + 0.691 * Math.pow(rgb.g, 2) + 0.068
      * Math.pow(rgb.b, 2));
    if (luminance >= 130) {
      return black;
    } else {
      return white;
    }
  }

  static extractOccurence(searchTerm: string, occurences: any): number {
    return [].concat.apply([], occurences)
      .filter((o) => o.index !== undefined && o.searchTerm === searchTerm)
      .length;
  }

  /**
   * Based on: https://stackoverflow.com/a/15030117/4807354
   * This method is used in order to flatten a nested array. It can contain any number of
   * nestings and sub arrays and will convert it to a single dimension or vector.
   * @param arr to be reduced to one dimension or vector
   */
  static flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten);
    }, []);
  }

  static addAttribute(elem: HTMLElement, classN: string) {
    if (elem.classList.contains(classN)) {

    }
  }
}
