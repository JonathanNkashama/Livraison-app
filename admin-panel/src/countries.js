const PAYS_AFRIQUE = [
  {
    code: 'CD', nom: 'République Démocratique du Congo', drapeau: '🇨🇩',
    region: 'Afrique Centrale',
    devises: [
      { code: 'USD', symbole: '$', nom: 'Dollar américain' },
      { code: 'CDF', symbole: 'FC', nom: 'Franc Congolais' }
    ],
    paiements: ['M-Pesa', 'Orange Money', 'Airtel Money', 'Afrimoney', 'Carte bancaire']
  },
  {
    code: 'CG', nom: 'Congo Brazzaville', drapeau: '🇨🇬',
    region: 'Afrique Centrale',
    devises: [{ code: 'XAF', symbole: 'FCFA', nom: 'Franc CFA Central' }],
    paiements: ['Airtel Money', 'MTN Money', 'Carte bancaire']
  },
  {
    code: 'CM', nom: 'Cameroun', drapeau: '🇨🇲',
    region: 'Afrique Centrale',
    devises: [{ code: 'XAF', symbole: 'FCFA', nom: 'Franc CFA Central' }],
    paiements: ['MTN Mobile Money', 'Orange Money', 'Carte bancaire']
  },
  {
    code: 'CI', nom: "Côte d'Ivoire", drapeau: '🇨🇮',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['Orange Money', 'MTN Mobile Money', 'Wave', 'Moov Money', 'Carte bancaire']
  },
  {
    code: 'SN', nom: 'Sénégal', drapeau: '🇸🇳',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['Orange Money', 'Wave', 'Free Money', 'Carte bancaire']
  },
  {
    code: 'NG', nom: 'Nigeria', drapeau: '🇳🇬',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'NGN', symbole: '₦', nom: 'Naira' }],
    paiements: ['Opay', 'Palmpay', 'MTN Mobile Money', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'GH', nom: 'Ghana', drapeau: '🇬🇭',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'GHS', symbole: 'GH₵', nom: 'Cedi' }],
    paiements: ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money', 'Carte bancaire']
  },
  {
    code: 'BJ', nom: 'Bénin', drapeau: '🇧🇯',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['MTN Mobile Money', 'Moov Money', 'Carte bancaire']
  },
  {
    code: 'BF', nom: 'Burkina Faso', drapeau: '🇧🇫',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['Orange Money', 'Moov Money', 'Carte bancaire']
  },
  {
    code: 'ML', nom: 'Mali', drapeau: '🇲🇱',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['Orange Money', 'Moov Money', 'Carte bancaire']
  },
  {
    code: 'TG', nom: 'Togo', drapeau: '🇹🇬',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'XOF', symbole: 'FCFA', nom: 'Franc CFA Ouest' }],
    paiements: ['Flooz', 'T-Money', 'Carte bancaire']
  },
  {
    code: 'GN', nom: 'Guinée', drapeau: '🇬🇳',
    region: "Afrique de l'Ouest",
    devises: [{ code: 'GNF', symbole: 'FG', nom: 'Franc guinéen' }],
    paiements: ['Orange Money', 'MTN Mobile Money', 'Carte bancaire']
  },
  {
    code: 'KE', nom: 'Kenya', drapeau: '🇰🇪',
    region: "Afrique de l'Est",
    devises: [{ code: 'KES', symbole: 'KSh', nom: 'Shilling kenyan' }],
    paiements: ['M-Pesa', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'TZ', nom: 'Tanzanie', drapeau: '🇹🇿',
    region: "Afrique de l'Est",
    devises: [{ code: 'TZS', symbole: 'TSh', nom: 'Shilling tanzanien' }],
    paiements: ['M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Carte bancaire']
  },
  {
    code: 'UG', nom: 'Ouganda', drapeau: '🇺🇬',
    region: "Afrique de l'Est",
    devises: [{ code: 'UGX', symbole: 'USh', nom: 'Shilling ougandais' }],
    paiements: ['MTN Mobile Money', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'RW', nom: 'Rwanda', drapeau: '🇷🇼',
    region: "Afrique de l'Est",
    devises: [{ code: 'RWF', symbole: 'RF', nom: 'Franc rwandais' }],
    paiements: ['MTN Mobile Money', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'BI', nom: 'Burundi', drapeau: '🇧🇮',
    region: "Afrique de l'Est",
    devises: [{ code: 'BIF', symbole: 'Fr', nom: 'Franc burundais' }],
    paiements: ['Lumicash', 'Ecocash', 'Carte bancaire']
  },
  {
    code: 'ET', nom: 'Éthiopie', drapeau: '🇪🇹',
    region: "Afrique de l'Est",
    devises: [{ code: 'ETB', symbole: 'Br', nom: 'Birr éthiopien' }],
    paiements: ['Telebirr', 'Carte bancaire']
  },
  {
    code: 'MG', nom: 'Madagascar', drapeau: '🇲🇬',
    region: "Afrique de l'Est",
    devises: [{ code: 'MGA', symbole: 'Ar', nom: 'Ariary' }],
    paiements: ['MVola', 'Orange Money', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'ZA', nom: 'Afrique du Sud', drapeau: '🇿🇦',
    region: 'Afrique Australe',
    devises: [{ code: 'ZAR', symbole: 'R', nom: 'Rand' }],
    paiements: ['SnapScan', 'MTN Mobile Money', 'Carte bancaire']
  },
  {
    code: 'ZM', nom: 'Zambie', drapeau: '🇿🇲',
    region: 'Afrique Australe',
    devises: [{ code: 'ZMW', symbole: 'ZK', nom: 'Kwacha zambien' }],
    paiements: ['MTN Mobile Money', 'Airtel Money', 'Carte bancaire']
  },
  {
    code: 'ZW', nom: 'Zimbabwe', drapeau: '🇿🇼',
    region: 'Afrique Australe',
    devises: [
      { code: 'ZWL', symbole: 'Z$', nom: 'Dollar zimbabwéen' },
      { code: 'USD', symbole: '$', nom: 'Dollar américain' }
    ],
    paiements: ['EcoCash', 'OneMoney', 'Carte bancaire']
  },
  {
    code: 'MZ', nom: 'Mozambique', drapeau: '🇲🇿',
    region: 'Afrique Australe',
    devises: [{ code: 'MZN', symbole: 'MT', nom: 'Metical' }],
    paiements: ['M-Pesa', 'Mkesh', 'Carte bancaire']
  },
  {
    code: 'AO', nom: 'Angola', drapeau: '🇦🇴',
    region: 'Afrique Australe',
    devises: [{ code: 'AOA', symbole: 'Kz', nom: 'Kwanza' }],
    paiements: ['Multicaixa Express', 'Unitel Money', 'Carte bancaire']
  },
  {
    code: 'MA', nom: 'Maroc', drapeau: '🇲🇦',
    region: 'Afrique du Nord',
    devises: [{ code: 'MAD', symbole: 'DH', nom: 'Dirham marocain' }],
    paiements: ['Orange Money', 'Inwi Money', 'Carte bancaire']
  },
  {
    code: 'DZ', nom: 'Algérie', drapeau: '🇩🇿',
    region: 'Afrique du Nord',
    devises: [{ code: 'DZD', symbole: 'DA', nom: 'Dinar algérien' }],
    paiements: ['CCP BaridiMob', 'Carte bancaire']
  },
  {
    code: 'TN', nom: 'Tunisie', drapeau: '🇹🇳',
    region: 'Afrique du Nord',
    devises: [{ code: 'TND', symbole: 'DT', nom: 'Dinar tunisien' }],
    paiements: ['Orange Money', 'Carte bancaire']
  },
  {
    code: 'EG', nom: 'Égypte', drapeau: '🇪🇬',
    region: 'Afrique du Nord',
    devises: [{ code: 'EGP', symbole: 'E£', nom: 'Livre égyptienne' }],
    paiements: ['Vodafone Cash', 'Orange Money', 'Carte bancaire']
  },
  {
    code: 'MU', nom: 'Maurice', drapeau: '🇲🇺',
    region: 'Îles Africaines',
    devises: [{ code: 'MUR', symbole: 'Rs', nom: 'Roupie mauricienne' }],
    paiements: ['MCB Juice', 'MyT Money', 'Carte bancaire']
  }
];

export default PAYS_AFRIQUE;