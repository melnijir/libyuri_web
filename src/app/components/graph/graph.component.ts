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
  nodes_index: number = 0;
  links_index: number = 0;

  line: any;

  @ViewChildren("nodesElements", {read: ElementRef}) nodesElements?: QueryList<ElementRef>;

  constructor(private commService: CommService, public linkEditor: MatDialog) {
    commService.newNode$.subscribe(
      nodeClass => {
        let node: GraphicNode = new GraphicNode();
        node.name = nodeClass.name+"_"+this.nodes_index.toString();
        node.class = nodeClass.name;
        node.params = nodeClass.params;
        this.nodes_index++;
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
    removeNode.linksOut.forEach(link => {
      this.removeLink(link);
    });
    removeNode.linksIn.forEach(link => {
      this.removeLink(link);
    });
    this.nodes = this.nodes.filter(node => { return (node !== removeNode) });
  }

  getExistingLink(fromNode: GraphicNode, toNode: GraphicNode, linkName: string): GraphicLink|undefined {
    let alreadyExisting = fromNode.linksOut.filter(link => {
      return (link.to == toNode && link.name == linkName)
    });
    if (alreadyExisting.length != 0)
      return alreadyExisting[0];
    return undefined;
  }

  getExistingLinkByName(fromNode: GraphicNode, linkName: string): GraphicLink|undefined {
    let alreadyExisting = fromNode.linksOut.filter(link => {
      return (link.name == linkName)
    });
    if (alreadyExisting.length != 0)
      return alreadyExisting[0];
    return undefined;
  }

  addLine(link: GraphicLink): any {
    return new LeaderLine(link.from_native, link.to_native, {
      color: 'black',
      middleLabel: LeaderLine.captionLabel(link.class + " ("+link.from_index.toString()+"-"+link.to_index.toString()+")")
    });
  }

  updateLines() {
    this.nodes.forEach(node => {
      let from_index: number = 0;
      node.linksOut.forEach(link => {
        link.line.remove();
        if (link.from_native && link.to_native) {
          link.from_index = from_index++;
          link.line = this.addLine(link);
        }
      })
    })
  }

  addLink(node: GraphicNode, targetNode: GraphicNode, linkName: string) {
    let existingLink = this.getExistingLink(node, targetNode, linkName);
    if (!existingLink) {
      let link: GraphicLink = new GraphicLink();
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
      link.name = node.name+"_to_"+targetNode.name+"_"+this.links_index.toString();
      const linkEditorRef = this.linkEditor.open(LinkEditorComponent, {
        data: link,
      });
      linkEditorRef.afterClosed().subscribe(link => {
        if (link) {
          // If it was only switching, remove possible old links
          this.removeLinkByName(node, linkName);
          // Add line and links to the node
          this.links_index++;
          link.from_index = link.from.linksOut.length;
          link.to_index = link.to.linksIn.length;
          link.line = this.addLine(link);
          link.from.linksOut.push(link);
          link.to.linksIn.push(link);
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
      removeLink.from.linksOut = removeLink.from.linksOut.filter(link => { return (link !== removeLink ) });
    if (removeLink.to)
      removeLink.to.linksIn = removeLink.to.linksIn.filter(link => { return (link !== removeLink ) });
    this.updateLines();
  }

  removeLinkByName(node: GraphicNode, linkName: string) {
    let removeLink = this.getExistingLinkByName(node, linkName);
    if (removeLink) {
      removeLink.line.remove();
      if (removeLink.from)
        removeLink.from.linksOut = removeLink.from.linksOut.filter(link => { return (link !== removeLink ) });
      if (removeLink.to)
        removeLink.to.linksIn = removeLink.to.linksIn.filter(link => { return (link !== removeLink ) });
    }
    this.updateLines();
  }

}