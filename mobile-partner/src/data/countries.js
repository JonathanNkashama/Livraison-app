const PAYS_AFRIQUE = [
  { code: 'CD', nom: 'RD Congo', drapeau: '🇨🇩', prefixe: '+243', devises: [{ code: 'USD', symbole: '$', nom: 'Dollar' }, { code: 'CDF', symbole: 'FC', nom: 'Franc Congolais' }], paiements: ['M-Pesa', 'Orange Money', 'Airtel Money', 'Afrimoney', 'Carte bancaire'] },
  { code: 'CG', nom: 'Congo Brazzaville', drapeau: '🇨🇬', prefixe: '+242', devises: [{ code: 'XAF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Airtel Money', 'Carte bancaire'] },
  { code: 'CM', nom: 'Cameroun', drapeau: '🇨🇲', prefixe: '+237', devises: [{ code: 'XAF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['MTN Money', 'Orange Money', 'Carte bancaire'] },
  { code: 'CI', nom: "Côte d'Ivoire", drapeau: '🇨🇮', prefixe: '+225', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Orange Money', 'MTN Money', 'Wave', 'Carte bancaire'] },
  { code: 'SN', nom: 'Sénégal', drapeau: '🇸🇳', prefixe: '+221', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Orange Money', 'Wave', 'Carte bancaire'] },
  { code: 'NG', nom: 'Nigeria', drapeau: '🇳🇬', prefixe: '+234', devises: [{ code: 'NGN', symbole: '₦', nom: 'Naira' }], paiements: ['MTN Money', 'Airtel Money', 'Carte bancaire'] },
  { code: 'GH', nom: 'Ghana', drapeau: '🇬🇭', prefixe: '+233', devises: [{ code: 'GHS', symbole: 'GH₵', nom: 'Cedi' }], paiements: ['MTN Money', 'Carte bancaire'] },
  { code: 'KE', nom: 'Kenya', drapeau: '🇰🇪', prefixe: '+254', devises: [{ code: 'KES', symbole: 'KSh', nom: 'Shilling' }], paiements: ['M-Pesa', 'Carte bancaire'] },
  { code: 'TZ', nom: 'Tanzanie', drapeau: '🇹🇿', prefixe: '+255', devises: [{ code: 'TZS', symbole: 'TSh', nom: 'Shilling' }], paiements: ['M-Pesa', 'Carte bancaire'] },
  { code: 'UG', nom: 'Ouganda', drapeau: '🇺🇬', prefixe: '+256', devises: [{ code: 'UGX', symbole: 'USh', nom: 'Shilling' }], paiements: ['MTN Money', 'Carte bancaire'] },
  { code: 'RW', nom: 'Rwanda', drapeau: '🇷🇼', prefixe: '+250', devises: [{ code: 'RWF', symbole: 'RF', nom: 'Franc' }], paiements: ['MTN Money', 'Carte bancaire'] },
  { code: 'BI', nom: 'Burundi', drapeau: '🇧🇮', prefixe: '+257', devises: [{ code: 'BIF', symbole: 'Fr', nom: 'Franc' }], paiements: ['Lumicash', 'Carte bancaire'] },
  { code: 'ZA', nom: 'Afrique du Sud', drapeau: '🇿🇦', prefixe: '+27', devises: [{ code: 'ZAR', symbole: 'R', nom: 'Rand' }], paiements: ['Carte bancaire'] },
  { code: 'MA', nom: 'Maroc', drapeau: '🇲🇦', prefixe: '+212', devises: [{ code: 'MAD', symbole: 'DH', nom: 'Dirham' }], paiements: ['Orange Money', 'Carte bancaire'] },
  { code: 'EG', nom: 'Égypte', drapeau: '🇪🇬', prefixe: '+20', devises: [{ code: 'EGP', symbole: 'E£', nom: 'Livre' }], paiements: ['Carte bancaire'] },
  { code: 'ET', nom: 'Éthiopie', drapeau: '🇪🇹', prefixe: '+251', devises: [{ code: 'ETB', symbole: 'Br', nom: 'Birr' }], paiements: ['Telebirr', 'Carte bancaire'] },
  { code: 'AO', nom: 'Angola', drapeau: '🇦🇴', prefixe: '+244', devises: [{ code: 'AOA', symbole: 'Kz', nom: 'Kwanza' }], paiements: ['Multicaixa', 'Carte bancaire'] },
  { code: 'MG', nom: 'Madagascar', drapeau: '🇲🇬', prefixe: '+261', devises: [{ code: 'MGA', symbole: 'Ar', nom: 'Ariary' }], paiements: ['Orange Money', 'Carte bancaire'] },
  { code: 'BJ', nom: 'Bénin', drapeau: '🇧🇯', prefixe: '+229', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['MTN Money', 'Carte bancaire'] },
  { code: 'BF', nom: 'Burkina Faso', drapeau: '🇧🇫', prefixe: '+226', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Orange Money', 'Carte bancaire'] },
  { code: 'ML', nom: 'Mali', drapeau: '🇲🇱', prefixe: '+223', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Orange Money', 'Carte bancaire'] },
  { code: 'TG', nom: 'Togo', drapeau: '🇹🇬', prefixe: '+228', devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA' }], paiements: ['Flooz', 'Carte bancaire'] },
  { code: 'GN', nom: 'Guinée', drapeau: '🇬🇳', prefixe: '+224', devises: [{ code: 'GNF', symbole: 'FG', nom: 'Franc' }], paiements: ['Orange Money', 'Carte bancaire'] },
  { code: 'ZM', nom: 'Zambie', drapeau: '🇿🇲', prefixe: '+260', devises: [{ code: 'ZMW', symbole: 'ZK', nom: 'Kwacha' }], paiements: ['MTN Money', 'Carte bancaire'] },
  { code: 'MZ', nom: 'Mozambique', drapeau: '🇲🇿', prefixe: '+258', devises: [{ code: 'MZN', symbole: 'MT', nom: 'Metical' }], paiements: ['M-Pesa', 'Carte bancaire'] }
];

export default PAYS_AFRIQUE;