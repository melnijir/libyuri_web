import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, delay, finalize, Observable, retry, retryWhen, Subject, take, throwError } from 'rxjs';
import { Class } from '../interfaces/class';
import { Pipe } from '../interfaces/pipe';
import { Node } from '../interfaces/node';
import { Link } from '../interfaces/link';
import { Message } from '../interfaces/message';
import { Log } from '../interfaces/log';
import { BackendError } from '../classes/backend-error';

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

  private newErrorSource = new Subject<BackendError>();
  newError$ = this.newErrorSource.asObservable();

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error occured
      this.addNewError(true, error.message);
    } else {
      // Error response
      this.addNewError(true, error.message);
    }
    return throwError(() => new Error('Not able to comunicate with backend.'));
  }

  addNewError(isError: boolean, message: string) {
    let backendError: BackendError = new BackendError(isError, message);
    this.newErrorSource.next(backendError);
  }
  
  private getStandardRequest<T>(urlPart: string): Observable<T> {
    return this.http.get<T>(yuriLocation+urlPart).pipe(catchError(this.handleError.bind(this)), retry({delay: 2000}));
  }

  getClasses(): Observable<Class[]> {
    return this.getStandardRequest<Class[]>("classes");
  }

  getPipes(): Observable<Pipe[]> {
    return this.getStandardRequest<Pipe[]>("pipes");
  }

  getLog(): Observable<Log> {
    return this.getStandardRequest<Log>("log");
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
