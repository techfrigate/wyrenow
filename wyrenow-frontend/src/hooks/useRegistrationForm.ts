import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchCountries, selectCountriesState } from '../redux/slices/countrySlice';
import { 
  FormData, 
  FormErrors, 
  Product, 
  CartItem, 
  RegistrationPackage 
} from '../types';
import { validateStep } from '../utils/validation';
import { REGISTRATION_PACKAGES } from '../constants';
import axios from 'axios';

const initialFormData: FormData = {
  // Geographic
  country: '',
  region: '',
  
  // Sponsor Information
  sponsorUsername: '',
  sponsorName: '',
  placementUsername: '',
  placementName: '',
  
  // User Details
  newUsername: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  transactionPin: '',
  
  // Package & Products
  selectedPackage: '',
  cart: [],
  
  // Payment
  walletPin: ''
};
const BASE_URL =  import.meta.env.VITE_APP_API_URL

console.log(BASE_URL)
export const useRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showWalletPin, setShowWalletPin] = useState(false);
  const [sponsorData,setSponsorData] =  useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const { countries } = useSelector(selectCountriesState);
  
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);
  
  // Find selected country and package
  
  const selectedCountry = countries?.find(c => c.id === Number(formData.country));
  const selectedPackage = REGISTRATION_PACKAGES.find(p => p.id === formData.selectedPackage);
  
  // Calculate totals
  const totalPV = formData.cart.reduce((sum, item) => sum + (item.product.pv * item.quantity), 0);
  const totalAmount = formData.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const packagePrice = selectedPackage?.price || 0;
  const grandTotal = packagePrice + totalAmount;
  
  /**
   * Updates form data with new values
   */
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  
  /**
   * Handles sponsor username search and validation
   */
  const handleSponsorUsernameChange = async (username: string) => {
    updateFormData({ sponsorUsername: username });
    try {
         setIsLoading(true);
         const resposne  = await axios.post(`${BASE_URL}/username`,{
           username :  username
         });
         console.log(JSON.parse(resposne.data.data.registration_data)
,"response or username")

         const SponsorNamr = JSON.parse(resposne.data.data.registration_data).AccountName;
          updateFormData({ sponsorName: SponsorNamr });
          setErrors(prev => ({ ...prev, sponsorUsername: '' }));
          setSponsorData(JSON.parse(resposne.data.data.registration_data));

    } catch (error) {
        updateFormData({ sponsorName: '' });
          setErrors(prev => ({ ...prev, sponsorUsername: 'Sponsor not found or not in your downline' }));
    } finally{
      setIsLoading(false);
    }
     
    
  
  };
  
  /**
   * Handles placement username search and validation
   */
  const handlePlacementUsernameChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username =  e.target.value;
    updateFormData({ placementUsername: username });
    
    if (username.length >= 3) {
      setIsLoading(true);
      // Simulate API call to fetch placement name
      setTimeout(() => {
        if (username === 'placement456') {
          updateFormData({ placementName: 'Jane Smith' });
          setErrors(prev => ({ ...prev, placementUsername: '' }));
        } else {
          updateFormData({ placementName: '' });
          setErrors(prev => ({ ...prev, placementUsername: 'Placement user not found' }));
        }
        setIsLoading(false);
      }, 1000);
    }
  };
  
  /**
   * Adds a product to the cart
   */
  const addToCart = (product: Product) => {
    const existingItem = formData.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      updateFormData({
        cart: [...formData.cart, { product, quantity: 1 }]
      });
    }
  };
  
  /**
   * Updates the quantity of a product in the cart
   */
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    updateFormData({
      cart: formData.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    });
  };
  
  /**
   * Removes a product from the cart
   */
  const removeFromCart = (productId: string) => {
    updateFormData({
      cart: formData.cart.filter(item => item.product.id !== productId)
    });
  };
  
  /**
   * Validates the current step and returns whether it's valid
   */
  const validateCurrentStep = (): boolean => {
    const newErrors = validateStep(currentStep, formData, selectedPackage, totalPV);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Moves to the next step if validation passes
   */
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };
  
  /**
   * Moves to the previous step
   */
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  /**
   * Handles final form submission
   */
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      alert('Registration completed successfully! Username: ' + formData.newUsername);
      // Reset form or redirect
    }, 2000);
  };
  
  return {
    currentStep,
    formData,
    errors,
    isLoading,
    selectedCountry,
    selectedPackage,
    totalPV,
    totalAmount,
    packagePrice,
    grandTotal,
    showPassword,
    showPin,
    showWalletPin,
    setShowPassword,
    setShowPin,
    setShowWalletPin,
    updateFormData,
    handleSponsorUsernameChange,
    handlePlacementUsernameChange,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    nextStep,
    prevStep,
    handleSubmit
  };
};