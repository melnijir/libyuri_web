import { Component, ElementRef, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { GraphicNode } from 'src/app/classes/graphic-node';
import { GraphicPipe } from 'src/app/classes/graphic-pipe';
import { CommService } from 'src/app/services/comm.service';

declare var LeaderLine: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {

  nodes: GraphicNode[] = [];
  pipes: GraphicPipe[] = [];

  line: any;

  @ViewChildren("nodesElements", {read: ElementRef}) nodesElements?: QueryList<ElementRef>;

  constructor(commService: CommService) {
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

  ngOnChanges() { }

  makeNodeActive(activeNode: GraphicNode) {
    this.nodes.forEach(node => {
      node.active = false;
    });
    activeNode.active = true;
  }

  removeNode(removeNode: GraphicNode) {
    let pipesToDelete = this.pipes.filter(pipe => { return (pipe.from === removeNode ) })
    pipesToDelete.forEach(pipe => { pipe.line.remove(); });
    this.pipes = this.pipes.filter(pipe => { return (pipe.from !== removeNode ) })
    this.nodes = this.nodes.filter(node => { return (node !== removeNode) });
  }

  existingPipe(node: GraphicNode, targetNode: GraphicNode): boolean {
    let alreadyExisting = this.pipes.filter(pipe => {
      return (pipe.from == node && pipe.to == targetNode)
    });
    return (alreadyExisting.length != 0)
  }

  addLine(pipe: GraphicPipe): any {
    return new LeaderLine(pipe.from_native, pipe.to_native, {
      color: 'black',
      middleLabel: LeaderLine.captionLabel('single')
    });
  }

  updateLines() {
    this.pipes.forEach(pipe => {
      pipe.line.remove();
      if (pipe.from_native && pipe.to_native) {
        pipe.line = this.addLine(pipe);
      }
    });
  }

  addPipe(node: GraphicNode, targetNode: GraphicNode) {
    if (!this.existingPipe(node, targetNode)) {
      let pipe: GraphicPipe = new GraphicPipe();
      this.nodesElements?.forEach(searchNode => {
        if (searchNode.nativeElement.id == "node-"+node.name) {
          pipe.from = node;
          pipe.from_native = searchNode.nativeElement;
        }
        if (searchNode.nativeElement.id == "node-"+targetNode.name) {
          pipe.to = targetNode;
          pipe.to_native = searchNode.nativeElement;
        }
      });
      if (pipe.from_native && pipe.to_native) {
        pipe.name = node.name+"-to-"+targetNode.name;
        pipe.line = this.addLine(pipe);
      }
      this.pipes.push(pipe);
    }
  }

  // onMakeLine(event: CdkDragEnd): void {
  //   console.log(event);
  //   if (true) {
  //       event.source._dragRef.reset();
  //   }
  // }


}