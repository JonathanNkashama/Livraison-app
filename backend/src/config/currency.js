// Taux de conversion vers USD (mis à jour manuellement)
// Tu peux automatisable plus tard avec une API gratuite
const TAUX_VERS_USD = {
  'USD': 1,
  'CDF': 0.00035,    // Franc Congolais
  'XOF': 0.0016,     // Franc CFA Ouest
  'XAF': 0.0016,     // Franc CFA Central
  'NGN': 0.00065,    // Naira nigérian
  'GHS': 0.068,      // Cedi ghanéen
  'KES': 0.0077,     // Shilling kenyan
  'TZS': 0.00038,    // Shilling tanzanien
  'UGX': 0.00027,    // Shilling ougandais
  'RWF': 0.00072,    // Franc rwandais
  'ETB': 0.0175,     // Birr éthiopien
  'ZAR': 0.054,      // Rand sud-africain
  'MAD': 0.099,      // Dirham marocain
  'DZD': 0.0074,     // Dinar algérien
  'EGP': 0.020,      // Livre égyptienne
  'TND': 0.32,       // Dinar tunisien
  'ZMW': 0.037,      // Kwacha zambien
  'MZN': 0.016,      // Metical mozambicain
  'AOA': 0.0011,     // Kwanza angolais
  'GNF': 0.000116,   // Franc guinéen
  'MGA': 0.00022,    // Ariary malgache
  'BIF': 0.00034,    // Franc burundais
  'MUR': 0.022,      // Roupie mauricienne
  'ZWL': 0.0031,     // Dollar zimbabwéen
};

const convertirEnUSD = (montant, devise) => {
  const taux = TAUX_VERS_USD[devise] || 1;
  return parseFloat((montant * taux).toFixed(2));
};

const formaterMontant = (montant, devise) => {
  const symboles = {
    'USD': '$', 'CDF': 'FC', 'XOF': 'FCFA', 'XAF': 'FCFA',
    'NGN': '₦', 'GHS': 'GH₵', 'KES': 'KSh', 'ZAR': 'R',
    'MAD': 'DH', 'EGP': 'E£', 'TZS': 'TSh', 'UGX': 'USh',
    'RWF': 'RF', 'ETB': 'Br', 'ZMW': 'ZK', 'MZN': 'MT',
    'AOA': 'Kz', 'GNF': 'FG', 'MGA': 'Ar', 'BIF': 'Fr',
    'MUR': 'Rs', 'ZWL': 'Z$', 'BIF': 'Fr', 'DZD': 'DA', 'TND': 'DT'
  };
  const symbole = symboles[devise] || devise;
  return `${symbole} ${Number(montant).toLocaleString()}`;
};

module.exports = { convertirEnUSD, formaterMontant, TAUX_VERS_USD };