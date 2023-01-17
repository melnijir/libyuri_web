import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/interfaces/node';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-nodes-list',
  templateUrl: './nodes-list.component.html',
  styleUrls: ['./nodes-list.component.css']
})
export class NodesListComponent implements OnInit {

  nodes?: Node[];

  constructor(private yuriService: YuriService) { }

  ngOnInit(): void {
  }
}
