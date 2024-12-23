import { colors } from '../../styles/colors';

export interface ColorFamily {
  name: string;
  colors: typeof colors[keyof typeof colors];
}

export const journeyColorFamilies = [
  { name: 'ocean', colors: colors.ocean },
  { name: 'coral', colors: colors.coral },
  { name: 'sage', colors: colors.sage },
  { name: 'sunset', colors: colors.sunset },
  { name: 'lavender', colors: colors.lavender },
  { name: 'mint', colors: colors.mint },
  { name: 'berry', colors: colors.berry },
  { name: 'honey', colors: { ...colors.honey } },
  { name: 'sand', colors: { ...colors.sand } },
  { name: 'shell', colors: { ...colors.shell } },
] as const;