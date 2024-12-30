import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {
  uploadedFiles: { file: File; base64: string }[] = [];
  xlsxTexts: string[] = [];
  pdfTexts: string[] = [];
  comparisonImageSrc: string = 'https://via.placeholder.com/300';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event, buttonId: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.convertFileToBase64(selectedFile).then((base64: string) => {
        this.uploadedFiles[buttonId - 1] = { file: selectedFile, base64 };
      });
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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

    this.http.post('http://localhost:8000/compare-documents-base64', requestBody).subscribe({
      next: (response) => {
        console.log('Comparison result:', response);
        alert('Comparison successful!');
      },
      error: (err) => {
        console.error('Error comparing files:', err);

        // Load fallback data from the .txt file
        this.http.get('assets/data/response.txt', { responseType: 'text' }).subscribe({
          next: (data) => {
            const parsedData = JSON.parse(data);
            this.xlsxTexts = parsedData.differences.differences.map((item: any) => item.xlsx_text);
            this.pdfTexts = parsedData.differences.differences.map((item: any) => item.pdf_text);
            this.comparisonImageSrc = `data:image/png;base64,${parsedData?.encoded_image || ''}`;
          },
          error: (fileErr) => {
            console.error('Error loading .txt file:', fileErr);
          },
        });
        alert('Comparison failed. Using fallback data.');
      },
    });
  }
}
