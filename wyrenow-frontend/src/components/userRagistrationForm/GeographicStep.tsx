import React, { useEffect } from 'react';
import { FormSelect } from '../ui';
import { Country, FormData, FormErrors } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { clearCountryErrors, fetchRegionsByCountry, selectCountriesState } from '../../redux/slices/countrySlice';
import type { AppDispatch } from '../../redux/store';
import LoadingSpinner from '../Layout/LoadingSpinner';
import toast from 'react-hot-toast';

interface GeographicStepProps {
  formData: FormData;
  errors: FormErrors;
  countries: Country[];
  updateFormData: (data: Partial<FormData>) => void;
  setErrors: (errors: FormErrors) => void;
}

const GeographicStep: React.FC<GeographicStepProps> = ({
  formData,
  errors,
  countries,
  updateFormData,
  setErrors
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {selectedCountry,regions,loading,error} = useSelector(selectCountriesState)

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ 
      country: e.target.value, 
      region: ''
    });
      setErrors({ ...errors, country: '' });
    dispatch(fetchRegionsByCountry(Number(e.target.value)));
  };


  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ region: e.target.value });
      setErrors({ ...errors, region: '' });
    dispatch({
      type: 'countries/setSelectedRegion',
      payload: e.target.value 
    })
  };


  useEffect(() => {
    if (error.countries || error.regions) {
      toast.error(error.countries || error.regions);
    }
    setTimeout(() => {
      dispatch(clearCountryErrors());
    }, 2000);
  }, [error]);

  if(loading.countries || loading.regions){
    return <LoadingSpinner message="Loading Regions" size='md' variant='primary'/>
  }

  return (
    <div className="space-y-6">
      <FormSelect
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleCountryChange}
        options={countries.map(country => ({ 
          value: country.id.toString(), 
          label: country.name 
        }))}
        placeholder="Select Country"
        required
        error={errors.country}
      />

      {selectedCountry && (
        <FormSelect
          label="Region/State"
          name="region"
          value={formData.region}
          onChange={handleRegionChange}
          options={regions.map(region => ({
            value: region.id.toString(),
            label: region.name
          }))}
          placeholder="Select Region/State"
          required
          error={errors.region}
        />
      )}
    </div>
  );
};

export default GeographicStep;