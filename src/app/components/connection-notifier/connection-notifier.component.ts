import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendError } from 'src/app/classes/backend-error';

@Component({
  selector: 'app-connection-notifier',
  templateUrl: './connection-notifier.component.html',
  styleUrls: ['./connection-notifier.component.css']
})
export class ConnectionNotifierComponent {

  constructor(public dialogRef: MatDialogRef<ConnectionNotifierComponent>, @Inject(MAT_DIALOG_DATA) public backendError: BackendError) {
    dialogRef.disableClose = true;
  }

}
