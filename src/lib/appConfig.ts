export type OutletSide = 'Left' | 'Center' | 'Right';

export type OutletConfig = {
  name: string;
  side: OutletSide;
};

export type AppConfig = {
  factCheckers: Record<string, boolean>;
  outlets: OutletConfig[];
};

export const defaultConfig: AppConfig = {
  factCheckers: {
    PolitiFact: true,
    Snopes: true,
    'FactCheck.org': true,
  },
  outlets: [
    { name: 'CNN', side: 'Left' },
    { name: 'MSNBC', side: 'Left' },
    { name: 'New York Times', side: 'Left' },
    { name: 'Reuters', side: 'Center' },
    { name: 'BBC News', side: 'Center' },
    { name: 'Associated Press', side: 'Center' },
    { name: 'Fox News', side: 'Right' },
    { name: 'Breitbart', side: 'Right' },
    { name: 'Daily Wire', side: 'Right' },
  ],
};

export const configStorageKey = 'unspun-config-v1';
