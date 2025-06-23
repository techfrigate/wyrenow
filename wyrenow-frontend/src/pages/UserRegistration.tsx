// import React, { useState, useEffect } from 'react';
// import { 
//   User, 
//   MapPin, 
//   Package, 
//   ShoppingCart, 
//   CreditCard,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Search,
//   Plus,
//   Minus,
//   Eye,
//   EyeOff,
//   AlertCircle,
//   CheckCircle,
//   Wallet
// } from 'lucide-react';
// import { useApp } from '../contexts/AppContext';
 
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../redux/store';
// import { get } from 'react-hook-form';
// import { fetchCountries, selectCountriesState } from '../redux/slices/countrySlice';

// interface RegistrationStep {
//   id: number;
//   title: string;
//   description: string;
// }

// interface Country {
//   id: string;
//   name: string;
//   regions: Region[];
// }

// interface Region {
//   id: string;
//   name: string;
// }

// interface RegistrationPackage {
//   id: string;
//   name: string;
//   price: number;
//   pvLimit: number;
//   description: string;
//   features: string[];
// }

// interface Product {
//   id: string;
//   name: string;
//   pv: number;
//   price: number;
//   image: string;
//   description: string;
// }

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export default function UserRegistration() {
//   const { currency } = useApp();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPin, setShowPin] = useState(false);
//   const [showWalletPin, setShowWalletPin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const dispatch  = useDispatch<AppDispatch>();
//   const { countries } = useSelector(selectCountriesState)
  
//   useEffect(()=>{
//     dispatch(fetchCountries());
//   },[dispatch]);


//   // Form data
//   const [formData, setFormData] = useState({
//     // Geographic
//     country: '',
//     region: '',
    
//     // Sponsor Information
//     sponsorUsername: '',
//     sponsorName: '',
//     placementUsername: '',
//     placementName: '',
    
//     // User Details
//     newUsername: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     transactionPin: '',
    
//     // Package & Products
//     selectedPackage: '',
//     cart: [] as CartItem[],
    
//     // Payment
//     walletPin: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const formatCurrency = (amount: number) => {
//     const symbol = currency === 'NGN' ? '₦' : 'GH₵';
//     return `${symbol}${amount.toLocaleString()}`;
//   };

//   const steps: RegistrationStep[] = [
//     {
//       id: 1,
//       title: 'Geographic Selection',
//       description: 'Select your country and region'
//     },
//     {
//       id: 2,
//       title: 'Sponsor Information',
//       description: 'Enter sponsor and placement details'
//     },
//     {
//       id: 3,
//       title: 'User Details',
//       description: 'Create user account information'
//     },
//     {
//       id: 4,
//       title: 'Package & Products',
//       description: 'Select registration package and products'
//     },
//     {
//       id: 5,
//       title: 'Payment & Confirmation',
//       description: 'Complete payment and confirm registration'
//     }
//   ];

 
//   const registrationPackages: RegistrationPackage[] = [
//     {
//       id: 'starter',
//       name: 'Starter Package',
//       price: 15000,
//       pvLimit: 50,
//       description: 'Perfect for beginners',
//       features: ['Basic starter kit', 'Training materials', 'Support access']
//     },
//     {
//       id: 'regular',
//       name: 'Regular Package',
//       price: 25000,
//       pvLimit: 100,
//       description: 'Most popular choice',
//       features: ['Enhanced starter kit', 'Advanced training', 'Priority support', 'Bonus products']
//     },
//     {
//       id: 'executive',
//       name: 'Executive Package',
//       price: 45000,
//       pvLimit: 200,
//       description: 'For serious entrepreneurs',
//       features: ['Premium starter kit', 'Executive training', 'VIP support', 'Exclusive bonuses', 'Leadership tools']
//     }
//   ];

//   const products: Product[] = [
//     {
//       id: 'small-bottle',
//       name: 'Small Health Bottle',
//       pv: 25,
//       price: 8500,
//       image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
//       description: 'Premium health supplement in small bottle'
//     },
//     {
//       id: 'big-bottle',
//       name: 'Big Health Bottle',
//       pv: 50,
//       price: 15000,
//       image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
//       description: 'Premium health supplement in large bottle'
//     },
//     {
//       id: 'wellness-kit',
//       name: 'Complete Wellness Kit',
//       pv: 75,
//       price: 22000,
//       image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
//       description: 'Comprehensive wellness package with multiple products'
//     }
//   ];
 

//   const selectedCountry = countries.find(c => c.id === Number(formData.country));
//   const selectedPackage = registrationPackages.find(p => p.id === formData.selectedPackage);
  
//   const totalPV = formData.cart.reduce((sum, item) => sum + (item.product.pv * item.quantity), 0);
//   const totalAmount = formData.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
//   const packagePrice = selectedPackage?.price || 0;
//   const grandTotal = packagePrice + totalAmount;


//   const handleSponsorUsernameChange = async (username: string) => {
//     setFormData(prev => ({ ...prev, sponsorUsername: username }));
    
//     if (username.length >= 3) {
//       setIsLoading(true);
//       // Simulate API call to fetch sponsor name
//       setTimeout(() => {
//         if (username === 'sponsor123') {
//           setFormData(prev => ({ ...prev, sponsorName: 'John Doe' }));
//           setErrors(prev => ({ ...prev, sponsorUsername: '' }));
//         } else {
//           setFormData(prev => ({ ...prev, sponsorName: '' }));
//           setErrors(prev => ({ ...prev, sponsorUsername: 'Sponsor not found or not in your downline' }));
//         }
//         setIsLoading(false);
//       }, 1000);
//     }
//   };

//   const handlePlacementUsernameChange = async (username: string) => {
//     setFormData(prev => ({ ...prev, placementUsername: username }));
    
//     if (username.length >= 3) {
//       setIsLoading(true);
//       // Simulate API call to fetch placement name
//       setTimeout(() => {
//         if (username === 'placement456') {
//           setFormData(prev => ({ ...prev, placementName: 'Jane Smith' }));
//           setErrors(prev => ({ ...prev, placementUsername: '' }));
//         } else {
//           setFormData(prev => ({ ...prev, placementName: '' }));
//           setErrors(prev => ({ ...prev, placementUsername: 'Placement user not found' }));
//         }
//         setIsLoading(false);
//       }, 1000);
//     }
//   };

//   const addToCart = (product: Product) => {
//     const existingItem = formData.cart.find(item => item.product.id === product.id);
    
//     if (existingItem) {
//       updateCartQuantity(product.id, existingItem.quantity + 1);
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         cart: [...prev.cart, { product, quantity: 1 }]
//       }));
//     }
//   };

//   const updateCartQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       cart: prev.cart.map(item =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     }));
//   };

//   const removeFromCart = (productId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       cart: prev.cart.filter(item => item.product.id !== productId)
//     }));
//   };

//   const validateStep = (step: number): boolean => {
//     const newErrors: Record<string, string> = {};

//     switch (step) {
//       case 1:
//         if (!formData.country) newErrors.country = 'Please select a country';
//         if (!formData.region) newErrors.region = 'Please select a region';
//         break;
//       case 2:
//         if (!formData.sponsorUsername) newErrors.sponsorUsername = 'Sponsor username is required';
//         if (!formData.sponsorName) newErrors.sponsorUsername = 'Valid sponsor required';
//         if (!formData.placementUsername) newErrors.placementUsername = 'Placement username is required';
//         if (!formData.placementName) newErrors.placementUsername = 'Valid placement user required';
//         break;
//       case 3:
//         if (!formData.newUsername) newErrors.newUsername = 'Username is required';
//         if (!formData.firstName) newErrors.firstName = 'First name is required';
//         if (!formData.lastName) newErrors.lastName = 'Last name is required';
//         if (!formData.email) newErrors.email = 'Email is required';
//         if (!formData.phone) newErrors.phone = 'Phone number is required';
//         if (!formData.password) newErrors.password = 'Password is required';
//         if (!formData.transactionPin) newErrors.transactionPin = 'Transaction PIN is required';
//         break;
//       case 4:
//         if (!formData.selectedPackage) newErrors.selectedPackage = 'Please select a package';
//         if (selectedPackage && totalPV > selectedPackage.pvLimit) {
//           newErrors.cart = `Total PV (${totalPV}) exceeds package limit (${selectedPackage.pvLimit})`;
//         }
//         break;
//       case 5:
//         if (!formData.walletPin) newErrors.walletPin = 'Wallet PIN is required for payment';
//         break;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(prev => Math.min(prev + 1, steps.length));
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(5)) return;

//     setIsLoading(true);
    
//     // Simulate registration process
//     setTimeout(() => {
//       setIsLoading(false);
//       alert('Registration completed successfully! Username: ' + formData.newUsername);
//       // Reset form or redirect
//     }, 2000);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Country *
//               </label>
//               <select
//                 value={formData.country}
//                 onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value, region: '' }))}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               >
//                 <option value="">Select Country</option>
//                 {countries.map(country => (
//                   <option key={country.id} value={country.id}>{country.name}</option>
//                 ))}
//               </select>
//               {errors.country && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.country}</p>}
//             </div>

//             {selectedCountry && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Region/State *
//                 </label>
//                 <select
//                   value={formData.region}
//                   onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="">Select Region/State</option>
//                   {selectedCountry?.regions?.map(region => (
//                     <option key={region.id} value={region.id}>{region.name}</option>
//                   ))}
//                 </select>
//                 {errors.region && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.region}</p>}
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Sponsor Username *
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={formData.sponsorUsername}
//                   onChange={(e) => handleSponsorUsernameChange(e.target.value)}
//                   placeholder="Enter sponsor username"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {isLoading && (
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                     <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                 )}
//               </div>
//               {formData.sponsorName && (
//                 <div className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400">
//                   <CheckCircle className="w-4 h-4" />
//                   <span className="text-sm">Sponsor: {formData.sponsorName}</span>
//                 </div>
//               )}
//               {errors.sponsorUsername && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sponsorUsername}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Placement Username *
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={formData.placementUsername}
//                   onChange={(e) => handlePlacementUsernameChange(e.target.value)}
//                   placeholder="Enter placement username"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {isLoading && (
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                     <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                 )}
//               </div>
//               {formData.placementName && (
//                 <div className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400">
//                   <CheckCircle className="w-4 h-4" />
//                   <span className="text-sm">Placement: {formData.placementName}</span>
//                 </div>
//               )}
//               {errors.placementUsername && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.placementUsername}</p>}
//             </div>

//             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//               <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Sponsor Information</h4>
//               <p className="text-sm text-blue-700 dark:text-blue-400">
//                 The sponsor must be a registered member in your upline. The placement user determines 
//                 where the new user will be positioned in the binary tree structure.
//               </p>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   New Username *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.newUsername}
//                   onChange={(e) => setFormData(prev => ({ ...prev, newUsername: e.target.value }))}
//                   placeholder="Enter new username"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {errors.newUsername && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newUsername}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                   placeholder="Enter email address"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.firstName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
//                   placeholder="Enter first name"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {errors.firstName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.lastName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
//                   placeholder="Enter last name"
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>}
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                 placeholder="Enter phone number"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               />
//               {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Password *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={formData.password}
//                     onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                     placeholder="Enter password"
//                     className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Transaction PIN *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPin ? 'text' : 'password'}
//                     value={formData.transactionPin}
//                     onChange={(e) => setFormData(prev => ({ ...prev, transactionPin: e.target.value }))}
//                     placeholder="Enter 4-digit PIN"
//                     maxLength={4}
//                     className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPin(!showPin)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                   >
//                     {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.transactionPin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transactionPin}</p>}
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             {/* Package Selection */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Select Registration Package
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {registrationPackages.map(pkg => (
//                   <div
//                     key={pkg.id}
//                     className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                       formData.selectedPackage === pkg.id
//                         ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
//                         : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
//                     }`}
//                     onClick={() => setFormData(prev => ({ ...prev, selectedPackage: pkg.id }))}
//                   >
//                     <div className="text-center">
//                       <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h4>
//                       <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 my-2">
//                         {formatCurrency(pkg.price)}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                         PV Limit: {pkg.pvLimit}
//                       </p>
//                       <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
//                         {pkg.features.map((feature, idx) => (
//                           <li key={idx} className="flex items-center">
//                             <Check className="w-3 h-3 text-green-500 mr-1" />
//                             {feature}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {errors.selectedPackage && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selectedPackage}</p>}
//             </div>

//             {/* Product Selection */}
//             {selectedPackage && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   Select Products (Optional)
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   {products.map(product => (
//                     <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="w-full h-32 object-cover rounded-lg mb-3"
//                       />
//                       <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                           {formatCurrency(product.price)}
//                         </span>
//                         <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded">
//                           {product.pv} PV
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => addToCart(product)}
//                         className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Shopping Cart */}
//                 {formData.cart.length > 0 && (
//                   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                     <h4 className="font-medium text-gray-900 dark:text-white mb-3">Shopping Cart</h4>
//                     <div className="space-y-3">
//                       {formData.cart.map(item => (
//                         <div key={item.product.id} className="flex items-center justify-between">
//                           <div className="flex items-center space-x-3">
//                             <img
//                               src={item.product.image}
//                               alt={item.product.name}
//                               className="w-12 h-12 object-cover rounded"
//                             />
//                             <div>
//                               <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
//                               <p className="text-sm text-gray-600 dark:text-gray-400">
//                                 {formatCurrency(item.product.price)} • {item.product.pv} PV
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
//                               className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
//                             >
//                               <Minus className="w-4 h-4" />
//                             </button>
//                             <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
//                               className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
//                             >
//                               <Plus className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
                    
//                     <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium text-gray-900 dark:text-white">
//                           Total PV: {totalPV} / {selectedPackage.pvLimit}
//                         </span>
//                         <span className="font-bold text-gray-900 dark:text-white">
//                           {formatCurrency(totalAmount)}
//                         </span>
//                       </div>
//                       {totalPV > selectedPackage.pvLimit && (
//                         <p className="text-sm text-red-600 dark:text-red-400 mt-2">
//                           Total PV exceeds package limit. Please remove some products.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {errors.cart && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cart}</p>}
//               </div>
//             )}
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             {/* Registration Summary */}
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Registration Summary
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Information</h4>
//                   <div className="space-y-1 text-sm">
//                     <p><span className="text-gray-600 dark:text-gray-400">Username:</span> {formData.newUsername}</p>
//                     <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {formData.firstName} {formData.lastName}</p>
//                     <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {formData.email}</p>
//                     <p><span className="text-gray-600 dark:text-gray-400">Phone:</span> {formData.phone}</p>
//                     <p><span className="text-gray-600 dark:text-gray-400">Location:</span> {selectedCountry?.name}, {selectedCountry?.regions?.find(r => r.id === Number(formData.region))?.name}</p>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sponsor Information</h4>
//                   <div className="space-y-1 text-sm">
//                     <p><span className="text-gray-600 dark:text-gray-400">Sponsor:</span> {formData.sponsorName} ({formData.sponsorUsername})</p>
//                     <p><span className="text-gray-600 dark:text-gray-400">Placement:</span> {formData.placementName} ({formData.placementUsername})</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Summary */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
//                 Payment Summary
//               </h3>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-blue-700 dark:text-blue-400">Package ({selectedPackage?.name}):</span>
//                   <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(packagePrice)}</span>
//                 </div>
                
//                 {formData.cart.map(item => (
//                   <div key={item.product.id} className="flex justify-between">
//                     <span className="text-blue-700 dark:text-blue-400">
//                       {item.product.name} x{item.quantity}:
//                     </span>
//                     <span className="font-medium text-blue-800 dark:text-blue-200">
//                       {formatCurrency(item.product.price * item.quantity)}
//                     </span>
//                   </div>
//                 ))}
                
//                 <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
//                   <div className="flex justify-between">
//                     <span className="font-semibold text-blue-800 dark:text-blue-200">Total Amount:</span>
//                     <span className="font-bold text-blue-900 dark:text-blue-100 text-lg">
//                       {formatCurrency(grandTotal)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Wallet PIN */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Enter Wallet PIN to Confirm Payment *
//               </label>
//               <div className="relative max-w-xs">
//                 <input
//                   type={showWalletPin ? 'text' : 'password'}
//                   value={formData.walletPin}
//                   onChange={(e) => setFormData(prev => ({ ...prev, walletPin: e.target.value }))}
//                   placeholder="Enter wallet PIN"
//                   maxLength={4}
//                   className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowWalletPin(!showWalletPin)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   {showWalletPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.walletPin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.walletPin}</p>}
//             </div>

//             {/* Wallet Balance Info */}
//             <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
//                 <span className="font-medium text-green-800 dark:text-green-300">Registration Wallet Balance</span>
//               </div>
//               <p className="text-2xl font-bold text-green-900 dark:text-green-200">
//                 {formatCurrency(125000)}
//               </p>
//               <p className="text-sm text-green-700 dark:text-green-400">
//                 Sufficient balance available for this registration
//               </p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Registration</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Register a new user under your sponsorship
//           </p>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between mb-8">
//           {steps.map((step, index) => (
//             <div key={step.id} className="flex items-center">
//               <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
//                 currentStep >= step.id
//                   ? 'bg-primary-600 border-primary-600 text-white'
//                   : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
//               }`}>
//                 {currentStep > step.id ? (
//                   <Check className="w-5 h-5" />
//                 ) : (
//                   <span className="text-sm font-medium">{step.id}</span>
//                 )}
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`w-16 h-0.5 mx-4 ${
//                   currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
//                 }`} />
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="text-center mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             {steps[currentStep - 1].title}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             {steps[currentStep - 1].description}
//           </p>
//         </div>

//         {/* Step Content */}
//         <div className="max-w-4xl mx-auto">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-8">
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 1}
//             className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Previous</span>
//           </button>

//           {currentStep < steps.length ? (
//             <button
//               onClick={nextStep}
//               className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <span>Next</span>
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-4 h-4" />
//                   <span>Complete Registration</span>
//                 </>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react';
import { useSelector } from 'react-redux';
import { useApp } from '../contexts/AppContext';
import { useRegistrationForm } from '../hooks';
import { selectCountriesState } from '../redux/slices/countrySlice';
import { REGISTRATION_STEPS } from '../constants';
import {
  GeographicStep,
  SponsorStep,
  UserDetailsStep,
  PackageStep,
  PaymentStep
} from '../components/userRagistrationForm';
 
import RegistrationLayout from '../components/Layout/RegistrationLayout';
 

const UserRegistration: React.FC = () => {
  const { currency } = useApp();
  const { countries, regions} = useSelector(selectCountriesState);
  
  const {
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
    nextStep,
    prevStep,
    handleSubmit
  } = useRegistrationForm();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeographicStep
            formData={formData}
            errors={errors}
            countries={countries}
            updateFormData={updateFormData}
          />
        );
      
      case 2:
        return (
          <SponsorStep
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            handleSponsorUsernameChange={handleSponsorUsernameChange}
            handlePlacementUsernameChange={handlePlacementUsernameChange}
          />
        );
      
      case 3:
        return (
          <UserDetailsStep
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showPin={showPin}
            setShowPassword={setShowPassword}
            setShowPin={setShowPin}
            updateFormData={updateFormData}
          />
        );
      
      case 4:
        return (
          <PackageStep
            formData={formData}
            errors={errors}
            currency={currency}
            selectedPackage={selectedPackage}
            totalPV={totalPV}
            totalAmount={totalAmount}
            updateFormData={updateFormData}
            addToCart={addToCart}
            updateCartQuantity={updateCartQuantity}
          />
        );
      
      case 5:
        return (
          <PaymentStep
            formData={formData}
            errors={errors}
            currency={currency}
            selectedCountry={selectedCountry}
            selectedPackage={selectedPackage}
            grandTotal={grandTotal}
            showWalletPin={showWalletPin}
            setShowWalletPin={setShowWalletPin}
            updateFormData={updateFormData}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <RegistrationLayout
      title="User Registration"
      subtitle="Register a new user under your sponsorship"
      steps={REGISTRATION_STEPS}
      currentStep={currentStep}
      isLoading={isLoading}
      onPrevious={prevStep}
      onNext={nextStep}
      onSubmit={handleSubmit}
      isLastStep={currentStep === REGISTRATION_STEPS.length}
    >
      {renderStepContent()}
    </RegistrationLayout>
  );
};

export default UserRegistration;



