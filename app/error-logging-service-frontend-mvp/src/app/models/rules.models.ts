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


export interface UserIn {
  first_name: string;
  last_name: string;
  role?: string;
  email: string;
  phone_number?: string;
}

export type RuleIn =
  | {
      user_id: number;
      user?: never;
      service_id: number;
      min_severity: Severity;
      enabled: boolean;
      do_email: boolean;
      do_call: boolean;
      do_halo_ticket: boolean;
    }
  | {
      user_id?: never;
      user: UserIn;
      service_id: number;
      min_severity: Severity;
      enabled: boolean;
      do_email: boolean;
      do_call: boolean;
      do_halo_ticket: boolean;
    };


