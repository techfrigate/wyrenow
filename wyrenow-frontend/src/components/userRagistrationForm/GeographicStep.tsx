import React from 'react';
import { FormSelect } from '../ui';
import { Country, FormData, FormErrors } from '../../types';
import { useDispatch } from 'react-redux';
import { fetchRegionsByCountry } from '../../redux/slices/countrySlice';
import type { AppDispatch } from '../../redux/store';

interface GeographicStepProps {
  formData: FormData;
  errors: FormErrors;
  countries: Country[];
  updateFormData: (data: Partial<FormData>) => void;
}

const GeographicStep: React.FC<GeographicStepProps> = ({
  formData,
  errors,
  countries,
  updateFormData
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ 
      country: e.target.value, 
      region: ''
    });
    dispatch(fetchRegionsByCountry(Number(e.target.value)));

     
  
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ region: e.target.value });
  };

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
          options={selectedCountry.regions.map(region => ({
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