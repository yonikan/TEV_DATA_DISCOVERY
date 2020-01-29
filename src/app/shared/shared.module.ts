import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from './page-header/page-header.component';
import { LoaderSpinnerComponent } from './loader-spinner/loader-spinner.component';
import { PmDropdownComponent } from './pm-dropdown/pm-dropdown.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ContactSupportDialogComponent } from './contact-support-dialog/contact-support-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    PageHeaderComponent,
    LoaderSpinnerComponent,
    PmDropdownComponent,
    TimePickerComponent,
	ProfileImageComponent,
	ErrorMessageComponent,
	ContactSupportDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ContentLoaderModule,
	TranslateModule,
	FormsModule,
	ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    ContentLoaderModule,
    TranslateModule,
    PageHeaderComponent,
    LoaderSpinnerComponent,
    PmDropdownComponent,
    TimePickerComponent,
	ProfileImageComponent,
	ErrorMessageComponent
  ],
  bootstrap: [ContactSupportDialogComponent]
})
export class SharedModule { }
