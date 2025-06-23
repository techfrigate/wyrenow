export const CURRENCY_SYMBOLS = {
  NGN: '₦',
  GHS: 'GH₵',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const PACKAGE_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' }
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const DEFAULT_PV_RATES = {
  NGN: 525,
  GHS: 12,
  USD: 1.5,
  EUR: 1.3,
  GBP: 1.1
};

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const GHANAIAN_REGIONS = [
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
  'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
  'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
];

export const COUNTRY_PRESETS = {
  Nigeria: {
    name: 'Nigeria',
    code: 'NG',
    currency: 'Nigerian Naira',
    currencySymbol: '₦',
    pvRate: 525,
    regions: NIGERIAN_STATES
  },
  Ghana: {
    name: 'Ghana',
    code: 'GH',
    currency: 'Ghanaian Cedi',
    currencySymbol: 'GH₵',
    pvRate: 12,
    regions: GHANAIAN_REGIONS
  }
};