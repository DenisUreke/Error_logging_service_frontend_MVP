import { Group } from '../models/group.models';

const offline = (name: string) => ({ name, status: 'Offline' as const });

export const GROUPS: Group[] = [
  {
    key: 'Saw',
    label: 'Saw',
    targets: [offline('Saw 1'), offline('Saw 2'), offline('Texo Sawbuffer')],
  },
  {
    key: 'Edgebanding',
    label: 'Edgebanding',
    targets: [offline('IMA FLV'), offline('IMA EB1'), offline('Biesse EB2'), offline('Stemas 4SPL')],
  },
  {
    key: 'Painting',
    label: 'Painting',
    targets: [
      offline('CEFLA 3D Soft Roller'),
      offline('CEFLA UVS 1'),
      offline('CEFLA UVS 2'),
      offline('CEFLA UVS 3'),
    ],
  },
  {
    key: 'Drill',
    label: 'Drill',
    targets: [offline('Biesse DRL2')],
  },
  {
    key: 'Logistics',
    label: 'Logistics',
    targets: [
      offline('Gebhardt FW'),
      offline('Gebhardt IMS'),
      offline('Gebhardt BOX'),
      offline('Gebhardt PALL'),
      offline('Max AGV'),
      offline('ABB Accessory'),
      offline('Amitec RMW'),
    ],
  },
  {
    key: 'Assembly',
    label: 'Assembly',
    targets: [
      offline('Top Drilling'),
      offline('Afry FB'),
      offline('Afry IMSD'),
      offline('TecnoLogica'),
      offline('Evomatic Box Collection'),
      offline('EvertJohanson ASMB'),
      offline('EvertJohanson Sorter'),
      offline('MSQ'),
    ],
  },
];
