import { AfterContentChecked, AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GraphicNode } from 'src/app/classes/graphic-node';
import { GraphicLink } from 'src/app/classes/graphic-link';
import { CommService } from 'src/app/services/comm.service';
import { LinkEditorComponent } from '../link-editor/link-editor.component';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { GraphicGraph } from 'src/app/classes/graphic-graph';

declare var LeaderLine: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewChecked {

  @Output() graphChanged = new EventEmitter<GraphicGraph>();

  graph: GraphicGraph = new GraphicGraph();

  recoverLink: boolean = false;
  recoverView: number = 0;

  line: any;

  @ViewChildren("nodesElements", {read: ElementRef}) nodesElements?: QueryList<ElementRef>;

  constructor(private commService: CommService, public linkEditor: MatDialog) {
    commService.newNode$.subscribe(nodeClass => {
      // We got new node from class list
      let node: GraphicNode = new GraphicNode();
      node.name = nodeClass.name+"_"+this.graph.nodes.length.toString();
      node.class = nodeClass.name;
      node.params = nodeClass.params;
      this.graph.nodes.push(node);
      this.graphChanged.emit(this.graph);
      this.commService.addChangedGraph(this.graph);
    });
    commService.newGraph$.subscribe(graph => {
      // Delete existing nodes in the graph
      if (this.graph.nodes.length) {
        this.graph.links.forEach(link => { this.removeLink(link); });
        this.graph.nodes.forEach(node => { this.removeNode(node); });
      }
      // Load a new one
      this.graph = graph;
      // Repair links array
      this.graph.links.forEach(link => {
        if (link.from && link.to) {
          link.from = this.getExistingNodeByName(link.from.name);
          link.to = this.getExistingNodeByName(link.to.name);
        }
      });
      this.recoverLink = true;
      this.recoverView = 0;
    });
  }

  ngAfterViewChecked(): void {
    // Repair links in graph if we have loaded a new one
    if (this.recoverLink && this.recoverView++ > 1) {
      this.graph.links.forEach(link => {
        if (link.from && link.to) {
          this.fillNativeElements(link.from, link.to, link);
          link.line = this.drawLine(link);
        }
      });
      this.recoverLink = false;
    }
  }

  makeNodeActive(activeNode: GraphicNode) {
    this.graph.nodes.forEach(node => {
      node.active = false;
    });
    activeNode.active = true;
  }

  saveNodePosition($event: CdkDragEnd, node: GraphicNode) {
    node.graphPosition = $event.source.getFreeDragPosition();
    this.graphChanged.emit(this.graph);
    this.commService.addChangedGraph(this.graph);
  }

  getExistingLink(fromNode: GraphicNode, toNode: GraphicNode, linkName: string): GraphicLink|undefined {
    let alreadyExisting = this.graph.links.filter(link => { return (link.from === fromNode && link.to === toNode && link.name === linkName) });
    if (alreadyExisting.length != 0) return alreadyExisting[0];
    return undefined;
  }

  getExistingLinkByName(linkName: string): GraphicLink|undefined {
    let alreadyExisting = this.graph.links.filter(link => { return (link.name === linkName) });
    if (alreadyExisting.length != 0) return alreadyExisting[0];
    return undefined;
  }

  getExistingLinksByNode(node: GraphicNode) {
    return this.graph.links.filter(link => { return (link.from == node) })
  }

  getExistingNodeByName(nodeName: string): GraphicNode|undefined {
    let nodes = this.getExistingNodesByName(nodeName);
    return (nodes?.length ? nodes[0] : undefined);
  }

  getExistingNodesByName(nodeName: string): GraphicNode[]|undefined {
    let alreadyExisting = this.graph.nodes.filter(node => { return (node.name === nodeName) });
    if (alreadyExisting.length != 0) return alreadyExisting;
    return undefined;
  }

  drawLine(link: GraphicLink): any {
    return new LeaderLine(link.from_native, link.to_native, {
      color: 'black',
      middleLabel: LeaderLine.captionLabel(link.class + " ("+link.from_index.toString()+"-"+link.to_index.toString()+")")
    });
  }

  updateLines() {
    this.graph.links.forEach(link => {
      if (typeof link.line.remove === "function") {
        link.line.remove();
      } else {
        console.log("Update tried to redraw not existing link with name: "+link.name);
      }
      if (link.from_native && link.to_native) {
        link.line = this.drawLine(link);
      } else {
        console.log("Update tried to link without from/to node set, link name: "+link.name);
      }
    });
    this.graphChanged.emit(this.graph);
    this.commService.addChangedGraph(this.graph);
  }

  fillNativeElements(fromNode: GraphicNode, toNode: GraphicNode, link: GraphicLink) {
    this.nodesElements?.forEach(searchNode => {
      if (searchNode.nativeElement.id == "node-"+fromNode.name) {
        link.from = fromNode;
        link.from_native = searchNode.nativeElement;
      }
      if (searchNode.nativeElement.id == "node-"+toNode.name) {
        link.to = toNode;
        link.to_native = searchNode.nativeElement;
      }
    });
  }

  addLinkDialog(fromNode: GraphicNode, toNode: GraphicNode, linkName: string) {
    let existingLink = this.getExistingLink(fromNode, toNode, linkName);
    if (!existingLink) {
      let link: GraphicLink = new GraphicLink();
      this.fillNativeElements(fromNode, toNode, link);
      link.name = fromNode.name+"_to_"+toNode.name+"_"+this.graph.links.length.toString();
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: link,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          // If it was only switching, remove possible old links
          this.removeLinkByName(linkName);
          // Draw line and add it into graph
          link.line = this.drawLine(link);
          this.graph.links.push(link);
        }
      });
    } else {
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: existingLink,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          existingLink = link;
        } else {
          if (existingLink)
            this.removeLink(existingLink);
        }
      });
    }
    this.updateLines();
  }

  removeLink(removeLink: GraphicLink) {
    if (typeof removeLink.line.remove === "function") {
      removeLink.line.remove();
    } else {
      console.log("Tried to remove not existing link, name: "+removeLink.name);
    }
    this.graph.links = this.graph.links.filter(link => { return (link !== removeLink) });
    this.updateLines();
  }

  removeLinkByName(linkName: string) {
    let removeLink = this.getExistingLinkByName(linkName);
    if (removeLink) this.removeLink(removeLink);
  }

  removeNode(removeNode: GraphicNode) {
    this.graph.links.forEach(link => {
      if (link.to === removeNode || link.from === removeNode)
        this.removeLink(link);
    })
    this.graph.nodes = this.graph.nodes.filter(node => { return (node !== removeNode) });
  }

}