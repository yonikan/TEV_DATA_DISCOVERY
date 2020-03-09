import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-are-you-sure-modal',
  templateUrl: './are-you-sure-modal.component.html',
  styleUrls: ['./are-you-sure-modal.component.scss']
})
export class AreYouSureModalComponent {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string, modalData?: any }
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }
}
