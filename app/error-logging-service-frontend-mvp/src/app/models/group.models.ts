export type MachineStatus = 'Online' | 'Offline' | 'Unknown';

export interface Target {
  name: string;
  status: MachineStatus;
}

export interface Group {
  key: string;
  label: string;
  targets: Target[];
}
