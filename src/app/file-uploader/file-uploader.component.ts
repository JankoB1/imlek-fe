import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [FileUploadService]
})
export class FileUploaderComponent {
  activeTab: string = 'pdfXlsx';
  selectedPdfFile: File | null = null;
  selectedXlsxFile: File | null = null;
  selectedPdfFile2: File | null = null;
  comparisonResult: {
    differences: {
      xlsx_text: string;
      pdf_text: string;
      explanation: string;
      referent_text: string;
      to_compare_text: string;
    }[],
    encoded_image: string,
    symbols_differences: {
      additional_symbols: { symbol: string }[],
      missing_symbols: { symbol: string }[]
    },
  } = {
    differences: [],
    encoded_image: '',
    symbols_differences: {
      additional_symbols: [],
      missing_symbols: []
    }
  };
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

  selectedDifferences: number[] = [];

  toggleSelection(index: number) {
    const selectedIndex = this.selectedDifferences.indexOf(index);
    if (selectedIndex > -1) {
      // Remove if already selected
      this.selectedDifferences.splice(selectedIndex, 1);
    } else {
      // Add if not selected
      this.selectedDifferences.push(index);
    }

    console.log(this.selectedDifferences);
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
            this.selectedDifferences = this.comparisonResult.differences.map((_, index) => index);
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
            console.log(this.comparisonResult);
            this.selectedDifferences = this.comparisonResult.differences.map((_, index) => index);
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

  generatePdf() {
    // if (!this.comparisonResult || !this.comparisonResult.differences.length) {
    //   return;
    // }

    // Define table body
    const tableBody = [
      ['XLSX Text', 'PDF Text', 'Explanation'], // Table header
      ...this.comparisonResult.differences.map(difference => [
        difference.xlsx_text,
        difference.pdf_text,
        difference.explanation
      ])
    ];

    // Define PDF document structure
    const documentDefinition = {
      content: [
        { text: 'Comparison Results', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'], // Flexible column widths
            body: [
              ['Referent Text', 'Comparing Text', 'Explanation'], // Table headers
              ...this.comparisonResult.differences.map((difference: any) => [
                difference.xlsx_text,
                difference.pdf_text,
                difference.explanation,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          margin: [0, 0, 0, 10], // Top, Right, Bottom, Left (4 elements)
        },
        subheader: {
          fontSize: 14,
          italics: true,
          margin: [0, 10, 0, 5], // Top, Right, Bottom, Left (4 elements)
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          margin: [5, 5, 5, 5], // Top, Right, Bottom, Left (4 elements)
        },
      },
    };

    pdfMake.createPdf(documentDefinition as any).download('comparison_results.pdf');


  }
}
