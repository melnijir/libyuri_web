import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Class } from '../interfaces/class';
import { Pipe } from '../interfaces/pipe';
import { Node } from '../interfaces/node';
import { Link } from '../interfaces/link';
import { Message } from '../interfaces/message';
import { Log } from '../interfaces/log';

const yuriLocation = 'http://localhost:8888/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'possible-future-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class YuriService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error occured
      console.error('An error occurred:', error.error);
    } else {
      // Error response
      console.error(`Backend returned code ${error.status}, body: `, error.error);
    }
    return throwError(() => new Error('Not able to comunicate with backend.'));
  }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(yuriLocation+"classes").pipe(catchError(this.handleError));
  }

  getPipes(): Observable<Pipe[]> {
    return this.http.get<Pipe[]>(yuriLocation+"pipes").pipe(catchError(this.handleError));
  }

  getLog(): Observable<Log> {
    return this.http.get<Log>(yuriLocation+"log").pipe(catchError(this.handleError));
  }

  addNode(node: Node): Observable<Message> {
    return this.http.post<Message>(yuriLocation+"node", node, httpOptions).pipe(catchError(this.handleError));
  }

  addLink(link: Link): Observable<Message> {
    return this.http.post<Message>(yuriLocation+"link", link, httpOptions).pipe(catchError(this.handleError));
  }

  start(): Observable<Message> {
    return this.http.put<Message>(yuriLocation+"start", {}, httpOptions).pipe(catchError(this.handleError));
  }

  stop(): Observable<Message> {
    return this.http.put<Message>(yuriLocation+"stop", {}, httpOptions).pipe(catchError(this.handleError));
  }


}
