import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Class } from '../interfaces/class';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  private newNodeSource = new Subject<Class>();

  newNode$ = this.newNodeSource.asObservable();

  addNewNode(nodeClass: Class) {
    this.newNodeSource.next(nodeClass);
  }
}
