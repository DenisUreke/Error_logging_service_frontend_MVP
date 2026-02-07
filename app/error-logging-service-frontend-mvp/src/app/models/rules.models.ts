import type { Severity } from './error.models';

export interface ServiceOut {
  id: number;
  created_at: string;
  name: string;
  group: string;
}

export interface RuleRowOut {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;

  rule_id: number;
  enabled: boolean;
  min_severity: Severity;
  do_email: boolean;
  do_call: boolean;
  do_halo_ticket: boolean;
}

export interface RuleIn {
  user_id: number;
  service_id: number;
  min_severity: Severity;

  enabled: boolean;
  do_email: boolean;
  do_call: boolean;
  do_halo_ticket: boolean;
}
