import { RegistrationStep, RegistrationPackage, Product } from '../types';

export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    id: 1,
    title: 'Geographic Selection',
    description: 'Select your country and region'
  },
  {
    id: 2,
    title: 'Sponsor Information',
    description: 'Enter sponsor and placement details'
  },
  {
    id: 3,
    title: 'User Details',
    description: 'Create user account information'
  },
  {
    id: 4,
    title: 'Package & Products',
    description: 'Select registration package and products'
  },
  {
    id: 5,
    title: 'Payment & Confirmation',
    description: 'Complete payment and confirm registration'
  }
];

export const REGISTRATION_PACKAGES: RegistrationPackage[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: 15000,
    pvLimit: 50,
    description: 'Perfect for beginners',
    features: ['Basic starter kit', 'Training materials', 'Support access']
  },
  {
    id: 'regular',
    name: 'Regular Package',
    price: 25000,
    pvLimit: 100,
    description: 'Most popular choice',
    features: ['Enhanced starter kit', 'Advanced training', 'Priority support', 'Bonus products']
  },
  {
    id: 'executive',
    name: 'Executive Package',
    price: 45000,
    pvLimit: 200,
    description: 'For serious entrepreneurs',
    features: ['Premium starter kit', 'Executive training', 'VIP support', 'Exclusive bonuses', 'Leadership tools']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'small-bottle',
    name: 'Small Health Bottle',
    pv: 25,
    price: 8500,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Premium health supplement in small bottle'
  },
  {
    id: 'big-bottle',
    name: 'Big Health Bottle',
    pv: 50,
    price: 15000,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Premium health supplement in large bottle'
  },
  {
    id: 'wellness-kit',
    name: 'Complete Wellness Kit',
    pv: 75,
    price: 22000,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Comprehensive wellness package with multiple products'
  }
];

export const WALLET_BALANCE = 125000;