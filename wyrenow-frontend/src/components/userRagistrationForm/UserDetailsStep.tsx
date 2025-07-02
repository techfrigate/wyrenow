import React from 'react';
import { FormInput } from '../ui';
import { FormData, FormErrors } from '../../types';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewUserData, selectRegistration } from '../../redux/slices/ragistrationSlice';
import { useAppSelector } from '../../hooks/redux';
import LoadingSpinner from '../Layout/LoadingSpinner';

interface UserDetailsStepProps {
  formData: FormData;
  errors: FormErrors;
  showPassword: boolean;
  showPin: boolean;
  setShowPassword: (show: boolean) => void;
  setShowPin: (show: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
  validUserLoading: boolean
}

const UserDetailsStep: React.FC<UserDetailsStepProps> = ({
  formData,
  errors,
  showPassword,
  showPin,
  setShowPassword,
  setShowPin,
  updateFormData,
  validUserLoading
}) => {

  const dispatch  =  useDispatch();
 // Declare timeid outside the component or use useRef
let timeid: NodeJS.Timeout;
const {loading,error,newUserData} = useAppSelector(selectRegistration);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if(name === 'newUsername' && value !== ''){
        // Clear existing timeout to prevent multiple API calls
        clearTimeout(timeid);
        timeid = setTimeout(() => {
            dispatch(getNewUserData(value));
        }, 2000);
      }else {
       clearTimeout(timeid);
     }

    updateFormData({ [name]: value });
};



  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="New Username"
          name="newUsername"
          value={formData.newUsername}
          onChange={handleChange}
          placeholder="Enter new username"
          required
          iconPosition='right'
          icon={loading.newUser?<LoadingSpinner size='sm' variant='primary'/>:undefined}
          error={errors.newUsername}
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
          required
          error={errors.firstName}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
          required
          error={errors.lastName}
        />
      </div>

      <FormInput
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter phone number"
        required
        error={errors.phone}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          error={errors.password}
          icon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          onIconClick={() => setShowPassword(!showPassword)}
        />

        <FormInput
          label="Transaction PIN"
          name="transactionPin"
          type={showPin ? 'text' : 'password'}
          value={formData.transactionPin}
          onChange={handleChange}
          placeholder="Enter 4-digit PIN"
          maxLength={4}
          required
          error={errors.transactionPin}
          icon={showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          onIconClick={() => setShowPin(!showPin)}
        />
      </div>
    </div>
  );
};

export default UserDetailsStep;