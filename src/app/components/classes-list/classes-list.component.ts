import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Class } from 'src/app/interfaces/class';
import { CommService } from 'src/app/services/comm.service';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {

  classes: Class[] = [];

  constructor(private yuriService: YuriService, private commService: CommService) { }

  ngOnInit(): void {
    this.retrieveClasses();
  }

  retrieveClasses(): void {
    this.yuriService.getClasses()
      .subscribe({
        next: (data) => {
          this.classes = data;
        },
        error: (error) => {
          console.log("Backend communication error, waiting for connection...");
        }
      });
  }

  addNewNode(node_class: Class) {
    this.commService.addNewNode(node_class);
  }
}
