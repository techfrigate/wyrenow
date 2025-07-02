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
import { checkSponsorPositionsById, clearAvailablePositions, findAvailablePositions, placeUserInBinaryTree } from '../redux/slices/ragistrationSlice';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import toast from 'react-hot-toast';

const initialFormData: FormData = {
  // Geographic
  country: '',
  region: '',
  
  // Sponsor Information
  sponsorUsername: '',
  sponsorName: '',
  placementUserid:0,
  placementLeg: '',
  placementUsername:'',
  
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
 
export const useRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showWalletPin, setShowWalletPin] = useState(false);
  const[showAlert,setShowAlert] = useState(false);
  const [sponsorData,setSponsorData] =  useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const { countries } = useSelector(selectCountriesState);
  const[placementLoading,setPlacementLoading] = useState(false)
  const {newUserData,availablePositions} =  useSelector((state: any) => state.registration);
  const[validUserLoading,setValidUserLoading] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);
  
  useEffect(()=>{
   if(newUserData){
     setFormData((prev) => ({
       ...prev,
       newUsername: newUserData.UserName,
       firstName: newUserData.FullName ? newUserData.FullName.split(' ')[0] : '',
       lastName: newUserData.FullName ? newUserData.FullName.split(' ').slice(1).join(' '): '',
       email: newUserData.Email,
   }))
    }else{
      setFormData((pre)=>({
        ...pre,
        firstName: '',
        lastName: '',
        email: ''
      }));
 
    }
  },[newUserData])
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

  const checkSponsorPositionsById = async (sponsorId: number) => {
    try {
      const resposne =  await axios.get(`${BASE_URL}/registration/sponsor/id/${sponsorId}`);
 
       if(resposne.data.success){
        const { left_leg_status, right_leg_status } = resposne.data.data;
 
        if(left_leg_status === 'filled' && right_leg_status === 'filled'){
          setShowAlert(true);
          updateFormData({ placementUsername: '', placementUserid: 0, placementLeg: '' });
          dispatch(clearAvailablePositions());
       } else{
          setShowAlert(false);
       }
      }
        return resposne.data
    } catch (error) {
      console.log('Error checking sponsor positions:', error);
    }
  };
  
  /**
   * Handles sponsor username search and validation
   */
  const handleSponsorUsernameChange = async (username: string,check:boolean) => {
    updateFormData({ sponsorUsername: username });
    try {
         setIsLoading(true);
         const resposne  = await axios.get(`${BASE_URL}/registration/check-username/${username}`);
          const {first_name, last_name} = resposne.data.data;
          updateFormData({ sponsorName: `${first_name} ${last_name}` });
          setErrors(prev => ({ ...prev, sponsorUsername: '' }));
          setSponsorData(resposne.data.data);
          if(check){
             checkSponsorPositionsById(resposne.data.data.id);
          }
    } catch (error) {
      dispatch(clearAvailablePositions())
        updateFormData({ sponsorName: '' , placementUsername: '', placementUserid: 0, placementLeg: '' });
          setErrors(prev => ({ ...prev, sponsorUsername: 'Sponsor not found or not in your downline' }));
    } finally{
      setIsLoading(false);
    }
  };
  
  /**
   * Handles placement username search and validation
   */
  const handlePlacementUsernameChange = async (leg: 'left' | 'right'| 'system') => {
    let legData =  leg==='system' ? 'right' : leg;
    setShowAlert(false);
    setPlacementLoading(true);
    try {
      const res =  await dispatch(findAvailablePositions({
         userId: sponsorData?.id ,
         leg:legData
      })).unwrap();
         updateFormData({placementUserid: res.data.user_id , placementLeg: leg, placementUsername:  res.data.first_name + ' ' + res.data.last_name });
          setErrors(prev => ({ ...prev, placementUsername: '' }));
      
    } catch (error) {
      console.log('Error fetching available positions:', error);
 
    }finally{
     setPlacementLoading(false);
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
  const nextStep = async () => {
    if (validateCurrentStep()) {
      if(currentStep === 3){
        setValidUserLoading(true);
        try {
          const res = await axios.post(`${BASE_URL}/registration/validate-user`,{
            username: formData.newUsername,
            email: formData.email,
            phone: formData.phone
          });

          if(res.data.success){
            if(res.data.data.length){
              toast.error("user Already exist with this email or phone number or username");
            }else{
             setCurrentStep(prev => Math.min(prev + 1, 5));
            }
          }
        } catch (error) {
          toast.error(error?.response?.data?.message  ||  'An unexpected error occurred');
        } finally{
          setValidUserLoading(false);
        }
      }else{
      setCurrentStep(prev => Math.min(prev + 1, 5));
      }
      
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
      const registerData= {
        username: formData.newUsername,
        sponsor_username: formData.sponsorUsername,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        transaction_pin: formData.transactionPin,
        country_id:  Number(formData.country),
        region_id: Number(formData.region),
        package_id: 1,
        placement_user_id: formData.placementUserid,
        placementLeg: formData.placementLeg||availablePositions?.available_position,
      }

       dispatch(placeUserInBinaryTree(registerData)).unwrap()
        .then((response) => {
          if (response.success) {
            toast.success(response.message || 'Registration successful');
            dispatch(clearAvailablePositions())
             setFormData(initialFormData);
             setCurrentStep(1);
             setErrors({}); 
             setShowAlert(false);
             setSponsorData(null);
            navigate('/dashboard');
          } else {
            toast.error(response.message || 'Registration failed');
          }
        })
        .catch((error) => {
          toast.error(error || 'Registration failed');
        }).finally(() => {
          setIsLoading(false);
        });
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
    handleSubmit,
    showAlert,
    setErrors,
    placementLoading,
    setPlacementLoading,
    validUserLoading
  };
};