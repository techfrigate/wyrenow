import React from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { Card } from '../ui';
import { 
  FormData, 
  FormErrors, 
  RegistrationPackage, 
  Product, 
  CartItem 
} from '../../types';
import { REGISTRATION_PACKAGES, PRODUCTS } from '../../constants';
import { formatCurrency } from '../../utils';

interface PackageStepProps {
  formData: FormData;
  errors: FormErrors;
  currency: string;
  selectedPackage: RegistrationPackage | undefined;
  totalPV: number;
  totalAmount: number;
  updateFormData: (data: Partial<FormData>) => void;
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
}

const PackageStep: React.FC<PackageStepProps> = ({
  formData,
  errors,
  currency,
  selectedPackage,
  totalPV,
  totalAmount,
  updateFormData,
  addToCart,
  updateCartQuantity
}) => {
  return (
    <div className="space-y-6">
      {/* Package Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select Registration Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGISTRATION_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.selectedPackage === pkg.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
              onClick={() => updateFormData({ selectedPackage: pkg.id })}
            >
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h4>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 my-2">
                  {formatCurrency(pkg.price, currency)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  PV Limit: {pkg.pvLimit}
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-3 h-3 text-green-500 mr-1" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {errors.selectedPackage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selectedPackage}</p>
        )}
      </div>

      {/* Product Selection */}
      {selectedPackage && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Products (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {PRODUCTS.map(product => (
              <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(product.price, currency)}
                  </span>
                  <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded">
                    {product.pv} PV
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* Shopping Cart */}
          {formData.cart.length > 0 && (
            <Card className="bg-gray-50 dark:bg-gray-700 p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Shopping Cart</h4>
              <div className="space-y-3">
                {formData.cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.product.price, currency)} • {item.product.pv} PV
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total PV: {totalPV} / {selectedPackage.pvLimit}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>
                {totalPV > selectedPackage.pvLimit && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    Total PV exceeds package limit. Please remove some products.
                  </p>
                )}
              </div>
            </Card>
          )}
          {errors.cart && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cart}</p>}
        </div>
      )}
    </div>
  );
};

export default PackageStep;