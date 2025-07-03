 
import React, { useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../components/Layout/LoadingScreen';
import { fetchPackages } from '../redux/slices/packageSlice';
import { useAppDispatch } from '../hooks/redux';
 

const UserRegistration: React.FC = () => {
  const { currency } = useApp();
  const { countries, regions} = useSelector(selectCountriesState);
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const{sponsorUsername, placementUserId,placementLeg ,placementName} = Object.fromEntries(searchParams.entries());
 
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
    showAlert,
    handleSubmit,
    setErrors,
    placementLoading,
    validUserLoading
 
  } = useRegistrationForm();
 
  useEffect(() => {
    if (sponsorUsername) {
      updateFormData({ sponsorUsername });
      handleSponsorUsernameChange(sponsorUsername, false);
    }
    if (placementUserId) {
      updateFormData({ placementUserid:Number(placementUserId) });
    }
    if (placementLeg) {
      const validLeg = placementLeg === "left" || placementLeg === "right" ? placementLeg : undefined;
      updateFormData({ placementLeg: validLeg });
    }
    if (placementName) {
      updateFormData({ placementUsername:placementName });
    }
    
    
  }, [sponsorUsername, placementUserId, placementLeg, placementName]);
 
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeographicStep
            formData={formData}
            errors={errors}
            countries={countries}
            updateFormData={updateFormData}
            setErrors={setErrors}
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
            showAlert={showAlert}
            placementLoading={placementLoading}
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
            validUserLoading={validUserLoading}
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
    <>
    
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
      validUserLoading={validUserLoading}
    >
      {renderStepContent()}
    </RegistrationLayout>
    
    </>
   
  );
};

export default UserRegistration;



