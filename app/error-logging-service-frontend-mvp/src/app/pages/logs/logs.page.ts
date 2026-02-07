import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorApiService } from '../../services/error-api.service';
import { ErrorOut, Severity } from '../../models/error.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.css'],

})
export class LogsPage {
  errors: ErrorOut[] = [];
  loading = false;
  message = '';

  severityFilter: 'ALL' | Severity = 'ALL';
  machineFilter: 'ALL' | string = 'ALL';

  constructor(private api: ErrorApiService, private cdr: ChangeDetectorRef) { }

  selected: ErrorOut | null = null;
  detailsText = 'MVP placeholder (select a log row)';

  private readonly mockDetails: string[] = [
    [
      'Unhandled exception caused the service to terminate.',
      '',
      'Source:',
      '  Service: CeflaMtoWeb',
      '  Function: PaintReportHandler.HandleReportAsync()',
      '  File: PaintReportHandler.cs',
      '  Line: 214',
      '',
      'Error:',
      '  System.NullReferenceException: Object reference not set to an instance of an object.',
      '',
      'Context:',
      '  WorkOrder: WO-472918',
      '  Station: UVS Paint Line 2',
      '  Last action: Building report payload before sending to SAP.',
      '',
      'Recommended action:',
      '  Verify payload inputs (BOM rows, paint material list) are not null and add guard clauses before serialization.'
    ].join('\n'),

    [
      'Integration call timed out while verifying machine connectivity.',
      '',
      'Source:',
      '  Service: InterfaceMonitor',
      '  Function: EndpointHealthChecker.PingAsync()',
      '  File: EndpointHealthChecker.cs',
      '  Line: 88',
      '',
      'Error:',
      '  TimeoutException: No response within 5000 ms.',
      '',
      'Context:',
      '  Endpoint: https://nobsa2ghint01:8443/interface/isconnected',
      '  Target: Gebhardt IMS',
      '  Retries: 3 (exhausted)',
      '',
      'Recommended action:',
      '  Check firewall rules, endpoint availability, and increase timeout if the service is known to respond slowly during startup.'
    ].join('\n'),

    [
      'Database insert failed due to constraint violation (duplicate key).',
      '',
      'Source:',
      '  Service: ErrorHandlingService',
      '  Function: ErrorRepository.InsertAsync()',
      '  File: ErrorRepository.cs',
      '  Line: 147',
      '',
      'Error:',
      '  SqlException: Cannot insert duplicate key row in object dbo.Errors with unique index IX_Errors_DedupeKey.',
      '',
      'Context:',
      '  DedupeKey: 9f3a2c7b-1c2d-4b2e-9d9a-0a11b77c2e99',
      '  Severity: ERROR',
      '  Machine: IMA Saw 01',
      '',
      'Recommended action:',
      '  Confirm deduplication logic. If duplicates are expected, adjust the index/logic or store occurrences separately.'
    ].join('\n'),

    [
      'Configuration mismatch detected after deployment.',
      '',
      'Source:',
      '  Service: PanelSaw',
      '  Function: Startup.ValidateConfiguration()',
      '  File: Startup.cs',
      '  Line: 61',
      '',
      'Error:',
      '  InvalidOperationException: Expected environment "PROD" but detected "TEST".',
      '',
      'Context:',
      '  AppSetting: EnvironmentName',
      '  Expected: PROD',
      '  Actual: TEST',
      '  Last action: Loading appsettings + environment variables.',
      '',
      'Recommended action:',
      '  Verify service account environment variables and configuration file mapping on the host server.'
    ].join('\n'),

    [
      'Unexpected payload format received from external system.',
      '',
      'Source:',
      '  Service: IMAWeb',
      '  Function: PayloadParser.ParseAsync()',
      '  File: PayloadParser.cs',
      '  Line: 302',
      '',
      'Error:',
      '  JsonException: The JSON value could not be converted to expected model type.',
      '',
      'Context:',
      '  Topic: system/status/robot',
      '  Field: "batteryLevel"',
      '  Received: "N/A"',
      '  Expected: number',
      '',
      'Recommended action:',
      '  Add schema validation + tolerant parsing (e.g., treat "N/A" as null) and log the raw payload for debugging.'
    ].join('\n'),
  ];


  selectRow(e: ErrorOut) {
    this.selected = e;

    const idx = Math.floor(Math.random() * this.mockDetails.length);
    this.detailsText = this.mockDetails[idx];
  }


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
  get machineOptions(): string[] {
    const set = new Set(this.errors.map(e => e.machine).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  get filteredErrors(): ErrorOut[] {
    return this.errors.filter(e => {
      const sev = (e.severity ?? '').toString().toUpperCase();
      const machineOk = this.machineFilter === 'ALL' || e.machine === this.machineFilter;
      const severityOk = this.severityFilter === 'ALL' || sev === this.severityFilter;
      return machineOk && severityOk;
    });
  }
}
