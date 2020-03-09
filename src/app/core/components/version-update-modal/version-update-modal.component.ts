import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-version-update-modal',
	templateUrl: './version-update-modal.component.html',
	styleUrls: ['./version-update-modal.component.scss']
})
export class VersionUpdateModalComponent {
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: { message: string, title: string, modalData?: any }
	) { }

	onCancel() {
		this.dialogRef.close();
	}

}
