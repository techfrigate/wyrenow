import React from 'react';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { Card, FormInput } from '../ui';
import { FormData, FormErrors, RegistrationPackage, Country, Region } from '../../types';
import { formatCurrency } from '../../utils';
import { WALLET_BALANCE } from '../../constants';

interface PaymentStepProps {
  formData: FormData;
  errors: FormErrors;
  currency: string;
  selectedCountry: Country | undefined;
  selectedPackage: RegistrationPackage | undefined;
  grandTotal: number;
  showWalletPin: boolean;
  setShowWalletPin: (show: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  errors,
  currency,
  selectedCountry,
  selectedPackage,
  grandTotal,
  showWalletPin,
  setShowWalletPin,
  updateFormData
}) => {
  const selectedRegion = selectedCountry?.regions.find(r => r.id === Number(formData.region));
  const packagePrice = selectedPackage?.price || 0;

  return (
    <div className="space-y-6">
      {/* Registration Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Registration Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Information</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600 dark:text-gray-400">Username:</span> {formData.newUsername}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {formData.firstName} {formData.lastName}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {formData.email}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Phone:</span> {formData.phone}</p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Location:</span> {selectedCountry?.name}, {selectedRegion?.name}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sponsor Information</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600 dark:text-gray-400">Sponsor:</span> {formData.sponsorName} ({formData.sponsorUsername})
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Placement:</span> {formData.placementName} ({formData.placementUsername})
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Summary */}
      <Card variant="info" className="p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
          Payment Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-blue-700 dark:text-blue-400">Package ({selectedPackage?.name}):</span>
            <span className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(packagePrice, currency)}</span>
          </div>
          
          {formData.cart.map(item => (
            <div key={item.product.id} className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-400">
                {item.product.name} x{item.quantity}:
              </span>
              <span className="font-medium text-blue-800 dark:text-blue-200">
                {formatCurrency(item.product.price * item.quantity, currency)}
              </span>
            </div>
          ))}
          
          <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-blue-800 dark:text-blue-200">Total Amount:</span>
              <span className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Wallet PIN */}
      <div>
        <FormInput
          label="Enter Wallet PIN to Confirm Payment"
          name="walletPin"
          type={showWalletPin ? 'text' : 'password'}
          value={formData.walletPin}
          onChange={(e) => updateFormData({ walletPin: e.target.value })}
          placeholder="Enter wallet PIN"
          maxLength={4}
          required
          error={errors.walletPin}
          icon={showWalletPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          onIconClick={() => setShowWalletPin(!showWalletPin)}
          className="max-w-xs"
        />
      </div>

      {/* Wallet Balance Info */}
      <Card variant="success" className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-800 dark:text-green-300">Registration Wallet Balance</span>
        </div>
        <p className="text-2xl font-bold text-green-900 dark:text-green-200">
          {formatCurrency(WALLET_BALANCE, currency)}
        </p>
        <p className="text-sm text-green-700 dark:text-green-400">
          Sufficient balance available for this registration
        </p>
      </Card>
    </div>
  );
};

export default PaymentStep;