export interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

export const COUNTRY_CODES: Country[] = [
  { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', dial_code: '+254', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦' },
  { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
  { code: 'RW', name: 'Rwanda', dial_code: '+250', flag: '🇷🇼' },
  { code: 'EG', name: 'Egypt', dial_code: '+20', flag: '🇪🇬' },
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  // You can add more countries here as you scale
];