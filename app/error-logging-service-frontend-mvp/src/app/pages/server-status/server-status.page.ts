import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GROUPS } from '../../models/groups.data';
import { Group } from '../../models/group.models';

@Component({
  selector: 'app-server-status-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-status.page.html',
  styleUrls: ['./server-status.page.css'],
})

export class ServerStatusPage {
  groups: Group[] = structuredClone(GROUPS);

  setAllOnline() {
    this.groups = this.groups.map(g => ({
      ...g,
      targets: g.targets.map(t => ({ ...t, status: 'Online' })),
    }));
  }
}
