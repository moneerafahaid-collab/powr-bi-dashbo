/**
 * DGA Platform Code — design tokens
 * @see https://design.dga.gov.sa/
 */

export const DGA = {
  sa: {
    600: '#1B8354',
    700: '#166A45',
    950: '#092A1E',
    100: '#DFF6E7',
    50: '#F3FCF6',
  },
  info: {
    950: '#102A56',
    900: '#194185',
    800: '#1849A9',
    700: '#175CD3',
    600: '#1570EF',
    500: '#2E90FA',
    100: '#D1E9FF',
    50: '#EFF8FF',
  },
  gray: {
    950: '#0D121C',
    900: '#111927',
    800: '#1F2A37',
    700: '#384250',
    500: '#6C737F',
    400: '#9DA4AE',
    300: '#D2D6DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB',
    25: '#FCFCFD',
  },
  gold: { 500: '#F5BD02', 600: '#DBA102' },
  success: { 600: '#079455', 50: '#ECFDF3' },
  error: { 600: '#D92D20', 50: '#FEF3F2' },
} as const;

export const DGA_HEADER_GRADIENT = `linear-gradient(270deg, ${DGA.info[950]} 0%, ${DGA.info[800]} 45%, ${DGA.info[600]} 100%)`;

export const DGA_CARD = 'bg-white border border-[#D2D6DB] rounded-lg shadow-[0_1px_2px_rgba(16,42,86,0.06)]';

export const DGA_CARD_TITLE = 'text-sm font-semibold text-[#384250]';
export const DGA_CARD_LABEL = 'text-xs font-medium text-[#6C737F]';
export const DGA_CARD_VALUE = 'text-[#111927] font-bold tabular-nums';
