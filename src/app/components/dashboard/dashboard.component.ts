import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GraphicGraph } from 'src/app/classes/graphic-graph';
import { CommService } from 'src/app/services/comm.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  downloadJsonUrl: SafeUrl = "";

  constructor(private sanitizer: DomSanitizer, private commService: CommService) {}

  updateGraph(graph: GraphicGraph) {
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
        this.commService.addNewGraph(JSON.parse(fileReader.result as string));
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    }
  }
}
