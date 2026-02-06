import { Group } from '../models/group.models';

const online = (name: string) => ({ name, status: 'Online' as const });

export const GROUPS: Group[] = [
  {
    key: 'Saw',
    label: 'Saw',
    targets: [online('Saw 1'), online('Saw 2'), online('Texo Sawbuffer')],
  },
  {
    key: 'Edgebanding',
    label: 'Edgebanding',
    targets: [online('IMA FLV'), online('IMA EB1'), online('Biesse EB2'), online('Stemas 4SPL')],
  },
  {
    key: 'Painting',
    label: 'Painting',
    targets: [
      online('CEFLA 3D Soft Roller'),
      online('CEFLA UVS 1'),
      online('CEFLA UVS 2'),
      online('CEFLA UVS 3'),
    ],
  },
  {
    key: 'Drill',
    label: 'Drill',
    targets: [online('Biesse DRL2')],
  },
  {
    key: 'Logistics',
    label: 'Logistics',
    targets: [
      online('Gebhardt FW'),
      online('Gebhardt IMS'),
      online('Gebhardt BOX'),
      online('Gebhardt PALL'),
      online('Max AGV'),
      online('ABB Accessory'),
      online('Amitec RMW'),
    ],
  },
  {
    key: 'Assembly',
    label: 'Assembly',
    targets: [
      online('Top Drilling'),
      online('Afry FB'),
      online('Afry IMSD'),
      online('TecnoLogica'),
      online('Evomatic Box Collection'),
      online('EvertJohanson ASMB'),
      online('EvertJohanson Sorter'),
      online('MSQ'),
    ],
  },
];
