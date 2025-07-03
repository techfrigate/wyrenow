import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';
import  Card  from '../ui/Card';
import { 
  FormData, 
  FormErrors, 
  RegistrationPackage, 
  Country 
} from '../../types/index';
import { formatCurrency, calculatePackagePrice, formatCurrencyPackage } from '../../utils/formatCurrency';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPackages } from '../../redux/slices/packageSlice';
import { fetchCountryById } from '../../redux/slices/countrySlice';
import LoadingSpinner from '../Layout/LoadingSpinner';

interface PackageStepProps {
  formData: FormData;
  errors: FormErrors;
  updateFormData: (data: Partial<FormData>) => void;
}

const PackageStep: React.FC<PackageStepProps> = ({
  formData,
  errors,
  updateFormData
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dispatch  = useAppDispatch();
   
  useEffect(()=>{
   dispatch(fetchPackages(Number(formData.country)));
   updateFormData({selectedPackage: ''})
  },[dispatch,formData.country])

   
   const {loading,error,packages}  = useAppSelector(state => state.package)  
  
 
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', checkScrollButtons);
      return () => scrollRef.current?.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Package Selection */}
{
    loading?<LoadingSpinner message='Loading Packages' size='xl'/>: <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Registration Package
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft 
                  ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight 
                  ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {packages.length && packages.map(pkg => {
              const price = pkg.price
              const isSelected = formData.selectedPackage === pkg.id;
              
              return (
                <div
                  key={pkg.id}
                  className={`flex-none w-80 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                  onClick={() => updateFormData({ selectedPackage: pkg.id })}
                >
    
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                       {packages[0].currency_symbol} {price}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {pkg.pv} PV
                    </p>
                    
                    {/* <div className="text-left space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div> */}
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {errors.selectedPackage && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.selectedPackage}</p>
        )}
      </div>
}
     

      {/* Price Summary */}
      {formData.selectedPackage && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {packages.find(p => p.id === formData.selectedPackage)?.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PV Rate: {packages[0].product_pv_rate} {packages[0].country_name} per PV
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                { 
              packages.find(p => p.id === formData.selectedPackage)?.currency_symbol + packages.find(p => p.id === formData.selectedPackage)?.price
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PackageStep;