import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aurum } from './aurum.model';

@Injectable()
export class DataLoadingService {

  constructor(private httpClient: HttpClient) { }

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
}
