import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FileUploaderComponent,
    RouterModule
  ]
})
export class FileUploaderModule { } 