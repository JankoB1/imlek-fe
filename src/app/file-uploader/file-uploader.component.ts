import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [FileUploadService]
})
export class FileUploaderComponent {
  selectedPdfFile: File | null = null;
  selectedXlsxFile: File | null = null;
  selectedPdfFile2: File | null = null;
  comparisonResult: any = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fileUploadService: FileUploadService) {}

  onPdfFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdfFile = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please select a valid PDF file';
    }
  }

  onXlsxFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.selectedXlsxFile = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please select a valid XLSX file';
    }
  }

  onPdfFile2Selected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdfFile2 = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please select a valid PDF file';
    }
  }

  compareXlsxPdf() {
    if (this.selectedPdfFile && this.selectedXlsxFile) {
      this.loading = true;
      this.fileUploadService.compareXlsxPdf(this.selectedPdfFile, this.selectedXlsxFile)
        .subscribe({
          next: (result) => {
            this.comparisonResult = result;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error comparing files: ' + error.message;
            this.loading = false;
          }
        });
    } else {
      this.errorMessage = 'Please select both PDF and XLSX files';
    }
  }

  comparePdfPdf() {
    if (this.selectedPdfFile && this.selectedPdfFile2) {
      this.loading = true;
      this.fileUploadService.comparePdfPdf(this.selectedPdfFile, this.selectedPdfFile2)
        .subscribe({
          next: (result) => {
            this.comparisonResult = result;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error comparing files: ' + error.message;
            this.loading = false;
          }
        });
    } else {
      this.errorMessage = 'Please select both PDF files';
    }
  }
}
