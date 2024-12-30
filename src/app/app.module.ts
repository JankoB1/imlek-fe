import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [
    HttpClientModule
  ],
  providers: [],
  exports: [
    FileUploaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
