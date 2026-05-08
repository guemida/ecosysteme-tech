/* Géographie — pays et tracés SVG simplifiés Europe + Afrique. */

export const EU_COUNTRIES = {
  FR: { name: 'France',      flag: '🇫🇷', x: 380, y: 330 },
  DE: { name: 'Allemagne',   flag: '🇩🇪', x: 490, y: 270 },
  BE: { name: 'Belgique',    flag: '🇧🇪', x: 410, y: 275 },
  NL: { name: 'Pays-Bas',    flag: '🇳🇱', x: 445, y: 235 },
  LU: { name: 'Luxembourg',  flag: '🇱🇺', x: 450, y: 300 },
  CH: { name: 'Suisse',      flag: '🇨🇭', x: 475, y: 340 },
  AT: { name: 'Autriche',    flag: '🇦🇹', x: 555, y: 335 },
  IT: { name: 'Italie',      flag: '🇮🇹', x: 520, y: 410 },
  ES: { name: 'Espagne',     flag: '🇪🇸', x: 300, y: 430 },
  PT: { name: 'Portugal',    flag: '🇵🇹', x: 230, y: 440 },
  SE: { name: 'Suède',       flag: '🇸🇪', x: 555, y: 135 },
  DK: { name: 'Danemark',    flag: '🇩🇰', x: 495, y: 180 },
  FI: { name: 'Finlande',    flag: '🇫🇮', x: 640, y: 115 },
  NO: { name: 'Norvège',     flag: '🇳🇴', x: 490, y: 100 },
  GB: { name: 'Royaume-Uni', flag: '🇬🇧', x: 320, y: 215 },
  IE: { name: 'Irlande',     flag: '🇮🇪', x: 240, y: 225 }
};

export const EUROPE_BG_PATH = "M180,190 L240,150 L300,130 L380,100 L460,85 L550,90 L640,100 L680,140 L700,190 L690,260 L660,320 L620,380 L580,430 L520,470 L440,490 L360,485 L290,465 L240,430 L200,380 L180,320 L170,260 Z";

export const AFRICA_COUNTRIES = {
  MA: { name: 'Maroc',          flag: '🇲🇦', x: 150, y: 80,  city: 'Casablanca' },
  DZ: { name: 'Algérie',        flag: '🇩🇿', x: 245, y: 95,  city: 'Alger' },
  TN: { name: 'Tunisie',        flag: '🇹🇳', x: 310, y: 75,  city: 'Tunis' },
  EG: { name: 'Égypte',         flag: '🇪🇬', x: 430, y: 130, city: 'Le Caire' },
  SN: { name: 'Sénégal',        flag: '🇸🇳', x: 85,  y: 270, city: 'Dakar' },
  CI: { name: 'Côte d\'Ivoire', flag: '🇨🇮', x: 175, y: 340, city: 'Abidjan' },
  NG: { name: 'Nigeria',        flag: '🇳🇬', x: 285, y: 345, city: 'Lagos' },
  ET: { name: 'Éthiopie',       flag: '🇪🇹', x: 455, y: 320, city: 'Addis-Abeba' },
  KE: { name: 'Kenya',          flag: '🇰🇪', x: 460, y: 400, city: 'Nairobi' },
  RW: { name: 'Rwanda',         flag: '🇷🇼', x: 410, y: 410, city: 'Kigali' },
  ZA: { name: 'Afrique du Sud', flag: '🇿🇦', x: 355, y: 570, city: 'Johannesburg' },
  CM: { name: 'Cameroun',       flag: '🇨🇲', x: 325, y: 380, city: 'Douala' }
};

export const AFRICA_SHAPE = "M130,60 L250,45 L340,55 L440,90 L500,135 L520,210 L525,300 L510,380 L470,460 L420,530 L360,600 L300,620 L240,585 L200,520 L170,440 L140,360 L110,275 L85,195 L95,115 Z";
