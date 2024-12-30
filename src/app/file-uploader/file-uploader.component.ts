import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {
  uploadedFiles: { file: File; base64: string }[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event, buttonId: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.convertFileToBase64(selectedFile).then((base64: string) => {
        console.log(`Base64 representation of file uploaded via Button ${buttonId}:`, base64);

        // Store the file and its Base64 representation
        this.uploadedFiles[buttonId - 1] = { file: selectedFile, base64 };
      });
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  onCompareFiles(): void {
    if (this.uploadedFiles.length < 2 || !this.uploadedFiles[0] || !this.uploadedFiles[1]) {
      alert('Please upload both files before comparing.');
      return;
    }

    const requestBody = {
      pdf_base64: this.uploadedFiles[0]?.base64 || '',
      xlsx_base64: this.uploadedFiles[1]?.base64 || '',
    };

    // Send POST request
    this.http
      .post('http://localhost:8000/compare-documents-base64', requestBody)
      .subscribe({
        next: (response) => {
          console.log('Comparison result:', response);
          alert('Comparison successful!');
        },
        error: (err) => {
          console.error('Error comparing files:', err);
          alert('Comparison failed. Please try again.');
        },
      });
  }
}
