export type Severity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface ErrorIn {
  machine: string;
  message: string;
  severity?: Severity;
  timestamp?: string; // ISO string
  context?: Record<string, any>;
}

export interface ErrorOut {
  id: number;
  created_at: string; // ISO string
  machine: string;
  message: string;
  severity: Severity | string;
}
