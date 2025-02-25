import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.compareSvcUrl; // Adjust this to your FastAPI server URL

  constructor(private http: HttpClient) { }

  compareXlsxPdf(pdfFile: File, xlsxFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('xlsx_file', xlsxFile);

    return this.http.post(`${this.baseUrl}/compare-xlsx-pdf`, formData);
  }

  comparePdfPdf(pdfFile1: File, pdfFile2: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf_file_referent', pdfFile1);
    formData.append('pdf_file_to_compare', pdfFile2);

    return this.http.post(`${this.baseUrl}/compare-pdf-pdf`, formData);
  }
}
