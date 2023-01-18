import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GraphicNode } from 'src/app/classes/graphic-node';
import { Class } from 'src/app/interfaces/class';
import { Node } from 'src/app/interfaces/node';
import { CommService } from 'src/app/services/comm.service';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  nodes: GraphicNode[] = [];

  constructor(private yuriService: YuriService, commService: CommService) {
    commService.newNode$.subscribe(
      nodeClass => {
        let node: GraphicNode = new GraphicNode();
        node.name = nodeClass.name;
        node.class = nodeClass.name;
        node.params = nodeClass.params;
        this.nodes.push(node);
      }
    )
  }

  makeNodeActive(active_node: GraphicNode) {
    this.nodes.forEach(node => {
      node.active = false;
    });
    active_node.active = true;
  }

  removeNode(remove_node: GraphicNode) {
    this.nodes = this.nodes.filter(node => {
      return (node !== remove_node)
    });
  }

}
