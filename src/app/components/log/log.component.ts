import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/interfaces/log';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  log?: Log;

  constructor(private yuriService: YuriService) { }

  ngOnInit(): void {
    this.retrieveLog();
  }

  retrieveLog(): void {
    this.yuriService.getLog()
      .subscribe({
        next: (data) => {
          this.log = data;
        },
        error: (e) => console.error(e)
      });
  }

  reloadLog() {
    this.retrieveLog();
  }
}
