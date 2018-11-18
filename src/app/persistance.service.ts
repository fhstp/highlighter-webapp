import { Injectable } from '@angular/core';

/**
 * This service will mainly be used later on maybe for storing something even if the user
 * refreshes the page. However, it's a generic class or service that can be used to store stuff.
 */
@Injectable({
  providedIn: 'root'
})
export class PersistanceService {

  constructor() {}

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error using local storage: ', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from local storage: ', e);
      return null;
    }
  }

  checkIfKeyExist(key: string): boolean {
    return localStorage.getItem(key) === null;
  }

  removeKey(key: string): void {
    localStorage.removeItem(key);
  }
}
