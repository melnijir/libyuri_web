import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/interfaces/class';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {

  classes: Class[] = [];

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
}
