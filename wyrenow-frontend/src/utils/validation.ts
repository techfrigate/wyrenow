import { FormData, FormErrors, RegistrationPackage } from '../types';

/**
 * Validates a specific step in the registration form
 * @param step The step number to validate
 * @param formData The current form data
 * @param selectedPackage The selected package (if any)
 * @param totalPV The total PV value of items in cart
 * @returns An object containing any validation errors
 */
export const validateStep = (
  step: number, 
  formData: FormData, 
  selectedPackage?: RegistrationPackage | undefined, 
  totalPV?: number
): FormErrors => {
  const errors: FormErrors = {};

  switch (step) {
    case 1:
      if (!formData.country) errors.country = 'Please select a country';
      if (!formData.region) errors.region = 'Please select a region';
      break;
      
    case 2:
      if (!formData.sponsorUsername) errors.sponsorUsername = 'Sponsor username is required';
      if (!formData.sponsorName) errors.sponsorUsername = 'Valid sponsor required';
      if (!formData.placementUsername) errors.placementUsername = 'Placement username is required';
      if (!formData.placementName) errors.placementUsername = 'Valid placement user required';
      break;
      
    case 3:
      if (!formData.newUsername) errors.newUsername = 'Username is required';
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
      if (!formData.password) errors.password = 'Password is required';
      if (!formData.transactionPin) errors.transactionPin = 'Transaction PIN is required';
      break;
      
    case 4:
      if (!formData.selectedPackage) errors.selectedPackage = 'Please select a package';
      if (selectedPackage && totalPV && totalPV > selectedPackage.pvLimit) {
        errors.cart = `Total PV (${totalPV}) exceeds package limit (${selectedPackage.pvLimit})`;
      }
      break;
      
    case 5:
      if (!formData.walletPin) errors.walletPin = 'Wallet PIN is required for payment';
      break;
  }

  return errors;
};