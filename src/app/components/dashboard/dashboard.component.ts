import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GraphicGraph } from 'src/app/classes/graphic-graph';
import { Graph } from 'src/app/interfaces/graph';
import { CommService } from 'src/app/services/comm.service';
import { YuriService } from 'src/app/services/yuri.service';
import { Node } from 'src/app/interfaces/node';
import { Link } from 'src/app/interfaces/link';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConnectionNotifierComponent } from '../connection-notifier/connection-notifier.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  downloadJsonUrl: SafeUrl = "";
  graph?: GraphicGraph;

  connectionNotifierOpened: boolean = false;
  connectionNotifierRef?: MatDialogRef<ConnectionNotifierComponent, any>

  constructor(private sanitizer: DomSanitizer, private commService: CommService, private yuriService: YuriService, public connectionNotifier: MatDialog) {
    yuriService.newError$.subscribe(connError => {
      // There was a problem with connection
      if (!this.connectionNotifierOpened) {
        this.connectionNotifierOpened = true;
          this.connectionNotifierRef = this.connectionNotifier.open(ConnectionNotifierComponent, {
          data: connError,
        });
      }
      if (this.connectionNotifierOpened && !connError.isError) {
        this.connectionNotifierRef?.close();
      }
    });
  }

  updateGraph(graph: GraphicGraph) {
    this.graph = graph;
    let graphJson = JSON.stringify(graph);
    let uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(graphJson));
    this.downloadJsonUrl = uri;
  }

  uploadGraph(target: EventTarget|null) {
    let files = (target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = () => {
        this.graph = JSON.parse(fileReader.result as string);
        if (this.graph)
          this.commService.addNewGraph(this.graph);
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    }
  }

  startGraph() {
    if (this.graph) {
      this.graph.nodes.forEach(node => {
        const sendNode: Node = {
          name: node.name,
          class: node.class,
          params: node.params
        };
        this.yuriService.addNode(sendNode).subscribe(res => {
          console.log(res);
        });
      });
      this.graph.links.forEach(link => {
        if (link.from && link.to) {
          const sendLink: Link = {
            name: link.name,
            class: link.class,
            params: link.params,
            src: link.from.name,
            dst: link.to.name
          };
          this.yuriService.addLink(sendLink).subscribe(res => {
            console.log(res);
          });
        }
      });
      this.yuriService.start().subscribe(res => {
        console.log(res);
      });
    }
  }

  stopGraph() {
    this.yuriService.stop().subscribe(res => {
      console.log(res);
    });
  }
}
