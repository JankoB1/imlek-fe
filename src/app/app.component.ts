import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploaderComponent } from "./file-uploader/file-uploader.component";
import {AppModule} from "./app.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'imlek-fe';
}
