import { Component, ElementRef, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GraphicNode } from 'src/app/classes/graphic-node';
import { GraphicLink } from 'src/app/classes/graphic-link';
import { CommService } from 'src/app/services/comm.service';
import { LinkEditorComponent } from '../link-editor/link-editor.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {

  nodes: GraphicNode[] = [];

  line: any;

  @ViewChildren("nodesElements", {read: ElementRef}) nodesElements?: QueryList<ElementRef>;

  constructor(private commService: CommService, public linkEditor: MatDialog) {
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
    removeNode.links.forEach(link => { link.line.remove(); });
    this.nodes = this.nodes.filter(node => { return (node !== removeNode) });
  }

  getExistingLink(node: GraphicNode, targetNode: GraphicNode): GraphicLink|undefined {
    let alreadyExisting = node.links.filter(link => {
      return (link.to == targetNode)
    });
    if (alreadyExisting.length != 0)
      return alreadyExisting[0];
    return undefined;
  }

  addLine(link: GraphicLink): any {
    return new LeaderLine(link.from_native, link.to_native, {
      color: 'black',
      middleLabel: LeaderLine.captionLabel(link.class)
    });
  }

  updateLines() {
    this.nodes.forEach(node => {
      node.links.forEach(link => {
        link.line.remove();
        if (link.from_native && link.to_native) {
          link.line = this.addLine(link);
        }
      })
    })
  }

  addLink(node: GraphicNode, targetNode: GraphicNode) {
    let existingLink = this.getExistingLink(node, targetNode);
    if (!existingLink) {
      let link = new GraphicLink();
      this.nodesElements?.forEach(searchNode => {
        if (searchNode.nativeElement.id == "node-"+node.name) {
          link.from = node;
          link.from_native = searchNode.nativeElement;
        }
        if (searchNode.nativeElement.id == "node-"+targetNode.name) {
          link.to = targetNode;
          link.to_native = searchNode.nativeElement;
        }
      });
      link.name = node.name+"-to-"+targetNode.name;
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: link,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          link.line = this.addLine(link);
          link.from.links.push(link);
        }
      });
    } else {
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: existingLink,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          existingLink = link;
          this.updateLines();
        } else {
          if (existingLink)
            this.removeLink(existingLink);
        }
      });
    }
  }

  removeLink(removeLink: GraphicLink) {
    removeLink.line.remove();
    if (removeLink.from)
      removeLink.from.links = removeLink.from.links.filter(link => { return (link !== removeLink ) });
  }

}