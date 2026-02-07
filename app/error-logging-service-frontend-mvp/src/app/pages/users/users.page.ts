import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ErrorApiService } from '../../services/error-api.service';
import { ServiceOut, RuleRowOut } from '../../models/rules.models';
import type { RuleIn } from '../../models/rules.models';
import type { Severity } from '../../models/error.models';
import type { UserOut } from '../../models/user.models';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.css'],
})
export class UsersPage implements OnInit {
  message = '';
  loading = false;
  saving = false;

  services: ServiceOut[] = [];
  machineOptions: string[] = ['Select machine...'];
  selectedMachine = this.machineOptions[0];

  // what /rules/by-machine returns
  rulesRows: RuleRowOut[] = [];
  selectedRow: RuleRowOut | null = null;

  // all users in system (for "add user" dropdown)
  allUsers: UserOut[] = [];
  usersLoading = false;
  selectedUserIdToAdd: number | null = null;

  // service lookup: name -> id
  private serviceIdByName = new Map<string, number>();

  // General rules (defaults for MVP) — we’ll use later
  general = {
    enabled: true,
    minSeverity: 'ERROR',
    doHaloTicket: true,
    doCall: false,
    doEmail: false,
  };

  constructor(private api: ErrorApiService) {}

  ngOnInit() {
    this.loadServices();
    this.loadAllUsers();
  }

  /* -----------------------------
   UI actions
  ------------------------------ */

  selectUser(row: RuleRowOut) {
    // copy so edits don’t mutate list until saved
    this.selectedRow = { ...row };
  }

  onMachineChanged() {
    if (!this.selectedMachine || this.selectedMachine === 'Select machine...') {
      this.rulesRows = [];
      this.selectedRow = null;
      this.message = '';
      return;
    }

    this.loading = true;
    this.message = `Loading users for ${this.selectedMachine}...`;
    this.rulesRows = [];
    this.selectedRow = null;

    this.api.listRulesByMachine(this.selectedMachine).subscribe({
      next: (rows) => {
        this.rulesRows = rows ?? [];
        this.message = this.rulesRows.length ? '' : 'No users found for this machine.';
        this.loading = false;
      },
      error: (err) => {
        this.message = 'Failed to load users for this machine.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  saveChanges() {
    if (!this.selectedRow) {
      this.message = 'Select a user first.';
      return;
    }

    const service_id = this.selectedServiceId;
    if (!service_id) {
      this.message = 'Select a machine first.';
      return;
    }

    this.saving = true;
    this.message = 'Saving changes...';

    const payload: RuleIn = {
      user_id: this.selectedRow.user_id,
      service_id,
      min_severity: this.selectedRow.min_severity,

      enabled: this.selectedRow.enabled,
      do_email: this.selectedRow.do_email,
      do_call: this.selectedRow.do_call,
      do_halo_ticket: this.selectedRow.do_halo_ticket,
    };

    this.api.upsertRule(payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Saved ✅';

        // Refresh list so left panel matches persisted state
        this.api.listRulesByMachine(this.selectedMachine).subscribe({
          next: (rows) => {
            this.rulesRows = rows ?? [];
            const updated = this.rulesRows.find(r => r.user_id === this.selectedRow?.user_id) ?? null;
            if (updated) this.selectedRow = { ...updated };
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => {
        this.saving = false;
        this.message = err?.error?.detail ? `Save failed: ${err.error.detail}` : 'Save failed.';
        console.error(err);
      },
    });
  }

  deleteSelectedRule() {
    if (!this.selectedRow) {
      this.message = 'Select a user first.';
      return;
    }

    const ruleId = this.selectedRow.rule_id;
    if (!ruleId) {
      this.message = 'No rule to delete for this user.';
      return;
    }

    if (!confirm('Delete this rule?')) return;

    this.saving = true;
    this.message = 'Deleting rule...';

    this.api.deleteRule(ruleId).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Rule deleted ✅';

        this.api.listRulesByMachine(this.selectedMachine).subscribe({
          next: (rows) => {
            this.rulesRows = rows ?? [];
            this.selectedRow = null;
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => {
        this.saving = false;
        this.message = err?.error?.detail ? `Delete failed: ${err.error.detail}` : 'Delete failed.';
        console.error(err);
      },
    });
  }

addSelectedUserToMachine() {
  const userId = Number(this.selectedUserIdToAdd);
  if (!userId) return;

  if (this.selectedMachine === 'Select machine...') return;

  const u = this.allUsers.find(x => x.id === userId);
  if (!u) return;

  // Prevent duplicates in UI list
  const exists = this.rulesRows.some(r => r.user_id === u.id);
  if (exists) {
    this.selectedUserIdToAdd = null;
    this.message = 'User already exists in this list.';
    return;
  }

  const newRow: RuleRowOut = {
    rule_id: 0,                 // 0 = not saved yet
    user_id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    phone_number: u.phone_number ?? '',

    enabled: true,
    min_severity: 'INFO',
    do_halo_ticket: false,
    do_call: false,
    do_email: false,
  };

  // Add to top of list and auto-select
  this.rulesRows = [newRow, ...this.rulesRows];
  this.selectedRow = { ...newRow };

  // Reset dropdown
  this.selectedUserIdToAdd = null;

  this.message = 'Added to list (not saved yet).';
}


  /* -----------------------------
   Data loading
  ------------------------------ */

  private loadServices() {
    this.loading = true;
    this.message = 'Loading services...';

    this.api.listServices().subscribe({
      next: (rows) => {
        this.services = rows ?? [];

        const names = this.services
          .map(s => s.name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        this.machineOptions = ['Select machine...', ...names];
        this.serviceIdByName = new Map(this.services.map(s => [s.name, s.id]));

        // reset machine view
        this.selectedMachine = this.machineOptions[0];
        this.rulesRows = [];
        this.selectedRow = null;

        this.message = '';
        this.loading = false;
      },
      error: (err) => {
        this.message = 'Failed to load services. Is the backend running?';
        this.loading = false;
        console.error(err);
      },
    });
  }

  private loadAllUsers() {
    this.usersLoading = true;

    this.api.listUsers().subscribe({
      next: (rows) => {
        this.allUsers = rows ?? [];
        this.usersLoading = false;
      },
      error: (err) => {
        this.usersLoading = false;
        console.error(err);
      },
    });
  }

  /* -----------------------------
   Helpers
  ------------------------------ */

  get selectedServiceId(): number | null {
    if (!this.selectedMachine || this.selectedMachine === 'Select machine...') return null;
    return this.serviceIdByName.get(this.selectedMachine) ?? null;
  }

  // Useful for dropdown: hide users already assigned to this machine
get availableUsers(): UserOut[] {
  const assigned = new Set(this.rulesRows.map(r => r.user_id));
  return (this.allUsers ?? []).filter(u => !assigned.has(u.id));
}

}
