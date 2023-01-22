import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GraphicLink } from 'src/app/classes/graphic-link';
import { Param } from 'src/app/interfaces/param';
import { Pipe } from 'src/app/interfaces/pipe';
import { YuriService } from 'src/app/services/yuri.service';

@Component({
  selector: 'app-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.css']
})
export class LinkEditorComponent implements OnInit {

  pipes: Pipe[] = [];

  constructor(public dialogRef: MatDialogRef<LinkEditorComponent>, @Inject(MAT_DIALOG_DATA) public link: GraphicLink, private yuriService: YuriService) { }

  ngOnInit(): void {
    this.retrievePipes();
  }

  retrievePipes(): void {
    this.yuriService.getPipes()
      .subscribe({
        next: (data) => {
          this.pipes = data;
        },
        error: (e) => console.error(e)
      });
  }

  getPipeParams(pipeName: string): Param[] {
    let filteredPipes = this.pipes.filter(pipe => { return (pipeName == pipe.name ) });
    if (filteredPipes.length > 0)
      return filteredPipes[0].params;
    return [];
  }

  removeLink(): void {
    this.dialogRef.close();
  }
}
