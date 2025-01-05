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
  pdfTexts2: string[] = [];
  pdfTexts3: string[] = [];
  comparisonImageSrc: string = 'https://via.placeholder.com/300';
  comparisonImageSrc2: string = 'https://via.placeholder.com/300';

  selectedTab: string = 'section1';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

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

      reader.onload = () => {
        const base64 = reader.result as string;
        // Log the first 100 characters of the base64 string
        console.log('Generated base64 for file:', file.name);
        console.log('Base64 preview:', base64.substring(0, 100) + '...');
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  onCompareFiles(): void {
    if (this.uploadedFiles.length < 2 || !this.uploadedFiles[0] || !this.uploadedFiles[1]) {
      alert('Please upload both files before comparing.');
      return;
    }

    // Log detailed information about the files and their base64
    console.log('Files to compare:', {
      file1: {
        name: this.uploadedFiles[0].file.name,
        type: this.uploadedFiles[0].file.type,
        size: this.uploadedFiles[0].file.size,
        base64Preview: this.uploadedFiles[0].base64.substring(0, 100) + '...'
      },
      file2: {
        name: this.uploadedFiles[1].file.name,
        type: this.uploadedFiles[1].file.type,
        size: this.uploadedFiles[1].file.size,
        base64Preview: this.uploadedFiles[1].base64.substring(0, 100) + '...'
      }
    });

    const requestBody = {
      pdf_base64: this.uploadedFiles[0]?.base64 || '',
      xlsx_base64: this.uploadedFiles[1]?.base64 || '',
    };

    this.http.post('http://localhost:8000/api/v1/compare-documents-base64', requestBody).subscribe({
      next: (response: any) => {
        this.xlsxTexts = response.differences.differences.map((item: any) => item.xlsx_text);
        this.pdfTexts = response.differences.differences.map((item: any) => item.pdf_text);
        this.comparisonImageSrc = `data:image/png;base64,${response?.encoded_image || ''}`;
      },
      error: (err) => {
        // More detailed error logging
        console.error('Error comparing files:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });

        // Load fallback data from the .txt file
        this.http.get('assets/data/response.txt', { responseType: 'text' }).subscribe({
          next: (data) => {
            try {
              const parsedData = JSON.parse(data);
              this.xlsxTexts = parsedData.differences.differences.map((item: any) => item.xlsx_text);
              this.pdfTexts = parsedData.differences.differences.map((item: any) => item.pdf_text);
              this.comparisonImageSrc = `data:image/png;base64,${parsedData?.encoded_image || ''}`;
            } catch (parseError) {
              console.error('Error parsing fallback data:', parseError);
              alert('Error parsing fallback data');
            }
          },
          error: (fileErr) => {
            console.error('Error loading fallback file:', fileErr);
            alert('Error loading fallback data');
          },
        });
        alert('Comparison failed. Using fallback data. Check console for details.');
      },
    });
  }

  onCompareFiles2(): void {
    if (this.uploadedFiles.length < 2 || !this.uploadedFiles[2] || !this.uploadedFiles[3]) {
      alert('Please upload both files before comparing.');
      return;
    }

    // Log detailed information about the files and their base64
    console.log('Files to compare:', {
      file1: {
        name: this.uploadedFiles[2].file.name,
        type: this.uploadedFiles[2].file.type,
        size: this.uploadedFiles[2].file.size,
        base64Preview: this.uploadedFiles[2].base64.substring(0, 100) + '...'
      },
      file2: {
        name: this.uploadedFiles[3].file.name,
        type: this.uploadedFiles[3].file.type,
        size: this.uploadedFiles[3].file.size,
        base64Preview: this.uploadedFiles[3].base64.substring(0, 100) + '...'
      }
    });

    const requestBody = {
      pdf_base64: this.uploadedFiles[2]?.base64 || '',
      pdf_base642: this.uploadedFiles[3]?.base64 || '',
    };

    this.http.post('http://localhost:8000/api/v1/compare-documents-base64-pdf', requestBody).subscribe({
      next: (response: any) => {
        this.pdfTexts2 = response.differences.differences.map((item: any) => item.xlsx_text);
        this.pdfTexts3 = response.differences.differences.map((item: any) => item.pdf_text);
        this.comparisonImageSrc2 = `data:image/png;base64,${response?.encoded_image || ''}`;
      },
      error: (err) => {
        // More detailed error logging
        console.error('Error comparing files:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });

        // Load fallback data from the .txt file
        this.http.get('assets/data/response.txt', { responseType: 'text' }).subscribe({
          next: (data) => {
            try {
              const parsedData = JSON.parse(data);
              this.pdfTexts2 = parsedData.differences.differences.map((item: any) => item.xlsx_text);
              this.pdfTexts3 = parsedData.differences.differences.map((item: any) => item.pdf_text);
              this.comparisonImageSrc2 = `data:image/png;base64,${parsedData?.encoded_image || ''}`;
            } catch (parseError) {
              console.error('Error parsing fallback data:', parseError);
              alert('Error parsing fallback data');
            }
          },
          error: (fileErr) => {
            console.error('Error loading fallback file:', fileErr);
            alert('Error loading fallback data');
          },
        });
        alert('Comparison failed. Using fallback data. Check console for details.');
      },
    });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      // Remove the data:application/pdf;base64, prefix
      const base64String = reader.result as string;
      const base64Data = base64String.split('base64,')[1];

      this.uploadedFiles.push({
        file: file,
        base64: base64Data
      });
    };

    reader.readAsDataURL(file);
  }
}
