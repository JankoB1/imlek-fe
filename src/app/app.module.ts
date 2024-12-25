import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [

  ],
  providers: [],
  exports: [
    FileUploaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
