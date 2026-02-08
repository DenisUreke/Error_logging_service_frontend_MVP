import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ErrorApiService } from '../../services/error-api.service';
import { GROUPS } from '../../models/groups.data';

type TimeRange = 'DAY' | 'WEEK' | 'MONTH' | 'MONTH_6' | 'YEAR';

@Component({
  selector: 'app-system-health-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-health.page.html',
  styleUrls: ['./system-health.page.css'],
})
export class SystemHealthPage {
  message = '';

  // Dropdowns
  machineOptions: string[] = this.buildMachineOptions();
  selectedMachine: string = this.machineOptions[0] ?? 'All machines';

  timeOptions: { value: TimeRange; label: string }[] = [
    { value: 'DAY', label: 'Last day' },
    { value: 'WEEK', label: 'Last week' },
    { value: 'MONTH', label: 'Last month' },
    { value: 'MONTH_6', label: 'Last 6 months' },
    { value: 'YEAR', label: 'Last year' },
  ];
  selectedTime: TimeRange = 'WEEK';

  // Mock chart values (pie: ok/warn/bad)
  pie = { ok: 62, warn: 23, bad: 15 };

  // Mock bars (right chart)
  bars: { label: string; value: number }[] = [
    { label: 'Online', value: 72 },
    { label: 'Offline', value: 18 },
    { label: 'Unknown', value: 10 },
  ];

  columns: { label: string; value: number }[] = [
  { label: 'Mon', value: 40 },
  { label: 'Tue', value: 55 },
  { label: 'Wed', value: 35 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 50 },
  { label: 'Sat', value: 25 },
  { label: 'Sun', value: 60 },
];

severityCounts = [
  { label: 'WARN', value: 12 },
  { label: 'ERROR', value: 6 },
  { label: 'CRITICAL', value: 2 },
];

severityCounts_2 = [
  { label: 'WARN', value: 12 },
  { label: 'ERROR', value: 6 },
  { label: 'CRITICAL', value: 2 },
];



  constructor(private api: ErrorApiService, private cdr: ChangeDetectorRef) {
    this.refreshMock();
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

  createExcel() {
  this.message = '';
  this.cdr.detectChanges();

  this.api.downloadHealthExcel().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system_health_report.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      this.message = 'Failed to generate Excel.';
      this.cdr.detectChanges();
      console.error(err);
    },
  });
}


  onFiltersChanged() {
    this.refreshMock();
  }

  // Used by CSS conic-gradient
  get pieStyle(): string {
    // ok -> warn -> bad
    return `conic-gradient(
      var(--ok) 0 ${this.pie.ok}%,
      #f1c40f ${this.pie.ok}% ${this.pie.ok + this.pie.warn}%,
      var(--bad) ${this.pie.ok + this.pie.warn}% 100%
    )`;
  }

  private refreshMock() {
    // Deterministic-ish mock based on selection to feel “consistent”
    const seed = this.hash(`${this.selectedMachine}|${this.selectedTime}`);
    const rnd = this.mulberry32(seed);

    const ok = Math.floor(40 + rnd() * 50); // 40..90
    const warn = Math.floor(rnd() * (100 - ok));
    const bad = 100 - ok - warn;

    this.pie = { ok, warn, bad };

    // bars: pretend distribution over time
    const online = Math.floor(50 + rnd() * 40);
    const offline = Math.floor(rnd() * (100 - online));
    const unknown = 100 - online - offline;

    this.bars = [
      { label: 'Online', value: online },
      { label: 'Offline', value: offline },
      { label: 'Unknown', value: unknown },
    ];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// generate 7 values between 10..95 so it's visually obvious
this.columns = days.map(d => ({
  label: d,
  value: Math.floor(10 + rnd() * 85),
}));

const warning = Math.floor(rnd() * 40);     // 0..39
const error = Math.floor(rnd() * 25);    // 0..24
const critical = Math.floor(rnd() * 10); // 0..9

this.severityCounts = [
  { label: 'WARN', value: warning },
  { label: 'ERROR', value: error },
  { label: 'CRITICAL', value: critical },
];

const warning_2 = Math.floor(rnd() * 40);     // 0..39
const error_2 = Math.floor(rnd() * 25);    // 0..24
const critical_2 = Math.floor(rnd() * 10); // 0..9

this.severityCounts_2 = [
  { label: 'WARN', value: warning_2 },
  { label: 'ERROR', value: error_2 },
  { label: 'CRITICAL', value: critical_2 },
];


  }

  private buildMachineOptions(): string[] {
    const machines = GROUPS.flatMap(g => g.targets.map(t => t.name));
    const uniq = Array.from(new Set(machines)).sort((a, b) => a.localeCompare(b));
    return ['All machines', ...uniq];
  }

  private hash(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  private mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  get selectedTimeLabel(): string {
  return this.timeOptions.find(t => t.value === this.selectedTime)?.label ?? '';
}

}
