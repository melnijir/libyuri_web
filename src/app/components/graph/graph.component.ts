import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Class } from 'src/app/interfaces/class';
import { Node } from 'src/app/interfaces/node';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  nodes: Node[] = [];
  classes: Class[] = [];
  inserted: Class[] = [];

  constructor(private yuriService: YuriService) { }

  ngOnInit(): void {
    this.retrieveClasses();
  }

  retrieveClasses(): void {
    this.yuriService.getClasses()
      .subscribe({
        next: (data) => {
          this.classes = data;
        },
        error: (e) => console.error(e)
      });
  }

  drop(event: CdkDragDrop<Class[]>) {
    // Stupid implemetation, just to test if it works
    if (event.previousContainer != event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      if (this.inserted.length > 0) {
        const added: Class = this.inserted[0];
        const node: Node = {
          name: added.name,
          class: added.name,
          params: added.params
        }
        this.nodes.push(node);
      }
      transferArrayItem(
        event.container.data,
        event.previousContainer.data,
        event.currentIndex,
        event.previousIndex,
      );
    }
  }

}
