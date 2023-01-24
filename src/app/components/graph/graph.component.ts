import { AfterContentChecked, AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GraphicNode } from 'src/app/classes/graphic-node';
import { GraphicLink } from 'src/app/classes/graphic-link';
import { CommService } from 'src/app/services/comm.service';
import { LinkEditorComponent } from '../link-editor/link-editor.component';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

declare var LeaderLine: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewChecked {

  @Output() graphChanged = new EventEmitter<GraphicNode[]>();

  nodes: GraphicNode[] = [];
  loadedLinks: GraphicLink[] = [];
  loadedView: number = 0;
  nodesIndex: number = 0;
  linksIndex: number = 0;

  line: any;

  @ViewChildren("nodesElements", {read: ElementRef}) nodesElements?: QueryList<ElementRef>;

  constructor(private commService: CommService, public linkEditor: MatDialog) {
    commService.newNode$.subscribe(
      nodeClass => {
        // We got new node from class list
        let node: GraphicNode = new GraphicNode();
        node.name = nodeClass.name+"_"+this.nodesIndex.toString();
        node.class = nodeClass.name;
        node.params = nodeClass.params;
        this.nodesIndex++;
        this.nodes.push(node);
        this.graphChanged.emit(this.nodes);
      }
    );
    commService.newGraph$.subscribe(
      graph => {
        // Repair connections deleted in JSON
        // it's needed to recover the nodes and after checked view also repair the lines
        this.linksIndex = 0;
        graph.forEach(node => {
          node.linksOut.forEach(link => {
            link.from = node;
            this.loadedLinks.push(link);
            this.removeLinkByName(node, link.name);
          });
        });
        this.nodes = graph;
        this.updateLines();
      }
    )
  }

  ngAfterViewChecked(): void {
    // Repair connections deleted in JSON
    // now the nodes are rendered, we'll recover the links
    if (this.loadedLinks.length && this.loadedView++ > 1) {
      this.loadedLinks.forEach(link => {
        if (link.to)
          link.to = this.getExistingNodeByName(link.to.name);
        if (link.from && link.to) {
          this.fillNativeElements(link.from, link.to, link);
          link.line = this.drawLine(link);
          link.from.linksOut.splice(link.from_index, 0, link);
          link.to.linksIn.splice(link.to_index, 0, link);
          this.linksIndex++;
        }
      });
      this.loadedLinks = [];
      this.loadedView = 0;
    }
  }

  makeNodeActive(activeNode: GraphicNode) {
    this.nodes.forEach(node => {
      node.active = false;
    });
    activeNode.active = true;
  }

  saveNodePosition($event: CdkDragEnd, node: GraphicNode) {
    node.graphPosition = $event.source.getFreeDragPosition();
    this.graphChanged.emit(this.nodes);
  }

  removeNode(removeNode: GraphicNode) {
    removeNode.linksOut.forEach(link => {
      this.removeLink(link);
    });
    removeNode.linksIn.forEach(link => {
      this.removeLink(link);
    });
    this.nodes = this.nodes.filter(node => { return (node !== removeNode) });
  }

  getExistingLink(fromNode: GraphicNode, toNode: GraphicNode, linkName: string): GraphicLink|undefined {
    let alreadyExisting = fromNode.linksOut.filter(link => { return (link.to == toNode && link.name == linkName) });
    if (alreadyExisting.length != 0) return alreadyExisting[0];
    return undefined;
  }

  getExistingLinkByName(fromNode: GraphicNode, linkName: string): GraphicLink|undefined {
    let alreadyExisting = fromNode.linksOut.filter(link => { return (link.name == linkName) });
    if (alreadyExisting.length != 0) return alreadyExisting[0];
    return undefined;
  }

  getExistingNodeByName(nodeName: string): GraphicNode|undefined {
    let alreadyExisting = this.nodes.filter(node => { return (node.name == nodeName) });
    if (alreadyExisting.length != 0) return alreadyExisting[0];
    return undefined;
  }

  drawLine(link: GraphicLink): any {
    return new LeaderLine(link.from_native, link.to_native, {
      color: 'black',
      middleLabel: LeaderLine.captionLabel(link.class + " ("+link.from_index.toString()+"-"+link.to_index.toString()+")")
    });
  }

  updateLines() {
    this.nodes.forEach(node => {
      node.linksOut.forEach(link => {
        if (typeof link.line.remove === "function")
          link.line.remove();
        if (link.from_native && link.to_native) {
          link.line = this.drawLine(link);
        }
      });
    });
    this.graphChanged.emit(this.nodes);
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
      link.name = fromNode.name+"_to_"+toNode.name+"_"+this.linksIndex.toString();
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: link,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          // If it was only switching, remove possible old links
          this.removeLinkByName(fromNode, linkName);
          // Add line and links to the node
          this.linksIndex++;
          link.line = this.drawLine(link);
          link.from.linksOut.splice(link.from_index, 0, link);
          link.to.linksIn.splice(link.to_index, 0, link);
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
    if (typeof removeLink.line.remove === "function")
      removeLink.line.remove();
    if (removeLink.from)
      removeLink.from.linksOut = removeLink.from.linksOut.filter(link => { return (link !== removeLink ) });
    if (removeLink.to)
      removeLink.to.linksIn = removeLink.to.linksIn.filter(link => { return (link !== removeLink ) });
    this.updateLines();
  }

  removeLinkByName(node: GraphicNode, linkName: string) {
    let removeLink = this.getExistingLinkByName(node, linkName);
    if (removeLink) this.removeLink(removeLink);
  }

}