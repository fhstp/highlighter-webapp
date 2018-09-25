import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aurum } from './aurum.model';

@Injectable()
export class DataLoadingService {

  constructor(private httpClient: HttpClient) {
    this.readLocalDataO().subscribe(data => {
      console.log('FROM service | After service was injected: ', data);
    });
  }

  /**
   * Returns an observable which can be .subscribe() to.
   */
  readLocalDataO(): Observable<Aurum> {
    return this.httpClient.get<Aurum>('/assets/sample-data.json');
  }

  /**
   * Returns a promise which can be resolved or read and afterwards used with .then()
   */
  readLocalDataP(): Promise<Aurum> {
    return this.httpClient.get<Aurum>('/assets/sample-data.json').toPromise();
  }

  /**
   * This method injects the read data into the DOM in order to update the view once new data arrives.
   * @param data First data that is injected into DOM
   * @param data2 Second optional data that is injected into DOM
   */
  injectIntoDOM(data: any, data2?: any) {
    console.log(data);
  }
}
