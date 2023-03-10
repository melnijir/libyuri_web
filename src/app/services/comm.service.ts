import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphicGraph } from '../classes/graphic-graph';
import { GraphicNode } from '../classes/graphic-node';
import { Class } from '../interfaces/class';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  private newNodeSource = new Subject<Class>();
  private newGraphSource = new Subject<GraphicGraph>();
  private changedGraphSource = new Subject<GraphicGraph>();

  newNode$ = this.newNodeSource.asObservable();
  newGraph$ = this.newGraphSource.asObservable();
  changedGraph$ = this.changedGraphSource.asObservable();

  addNewNode(nodeClass: Class) {
    this.newNodeSource.next(nodeClass);
  }

  addNewGraph(graph: GraphicGraph) {
    this.newGraphSource.next(graph);
  }

  addChangedGraph(graph: GraphicGraph) {
    this.changedGraphSource.next(graph);
  }
}
