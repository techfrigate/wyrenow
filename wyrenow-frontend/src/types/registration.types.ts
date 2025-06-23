export interface RegistrationStep {
  id: number;
  title: string;
  description: string;
}

export interface Country {
  id: number;
  name: string;
  regions: Region[];
}

export interface Region {
  id: number;
  name: string;
}

export interface RegistrationPackage {
  id: string;
  name: string;
  price: number;
  pvLimit: number;
  description: string;
  features: string[];
}

export interface Product {
  id: string;
  name: string;
  pv: number;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FormData {
  // Geographic
  country: string;
  region: string;
  
  // Sponsor Information
  sponsorUsername: string;
  sponsorName: string;
  placementUsername: string;
  placementName: string;
  
  // User Details
  newUsername: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  transactionPin: string;
  
  // Package & Products
  selectedPackage: string;
  cart: CartItem[];
  
  // Payment
  walletPin: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface CountryState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}