import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorApiService } from '../../services/error-api.service';
import { ErrorOut } from '../../models/error.models';

@Component({
  selector: 'app-logs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.css'],

})
export class LogsPage {
  errors: ErrorOut[] = [];
  loading = false;
  message = '';

  constructor(private api: ErrorApiService, private cdr: ChangeDetectorRef) {}

  loadErrors() {
    this.loading = true;
    this.message = '';
    this.cdr.detectChanges();

    this.api.listErrors(50).subscribe({
      next: (rows) => {
        this.errors = rows ?? [];
        this.message = this.errors.length ? '' : 'No errors found.';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = 'Failed to load errors. Is the backend running?';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  createPdf() {
    this.message = '';
    this.cdr.detectChanges();

    this.api.downloadHealthPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'system_health_report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.message = 'Failed to generate PDF.';
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }
}
