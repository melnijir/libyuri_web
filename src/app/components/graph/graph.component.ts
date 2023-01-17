import { CdkDragDrop } from '@angular/cdk/drag-drop';
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

  nodes?: Node[];
  classes?: Class[];

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

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
  }

}
