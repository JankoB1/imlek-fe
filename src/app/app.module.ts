import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  exports: [
    FileUploaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
