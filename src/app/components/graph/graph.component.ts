import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  drop(event: CdkDragDrop<string[]>) {
    console.log("Dropped!");
    console.log(event);
  }

}
