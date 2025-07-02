import React, { useState, useEffect } from 'react';
import { Package } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Toggle } from '../ui/Toggle';
import { PACKAGE_TYPES, DEFAULT_PV_RATES } from '../../utils/constants';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createPackage, updatePackage, clearError } from '../../store/slices/packageSlice';

interface PackageFormProps {
  initialData?: Package | null;
  onSuccess?: () => void;
  onCancel: () => void;
}

export function PackageForm({ initialData, onSuccess, onCancel }: PackageFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.packages);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pv: 0,
    priceNGN: 0,
    priceGHS: 0,
    bottles: 1,
    type: 'standard',
    status: 'active',
    features: ['']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoCalculate, setAutoCalculate] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        pv: initialData.pv,
        priceNGN: initialData.priceNGN,
        priceGHS: initialData.priceGHS,
        bottles: initialData.bottles,
        type: initialData.type,
        status: initialData.status,
        features: initialData.features.length > 0 ? initialData.features : ['']
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (autoCalculate && formData.pv > 0) {
      setFormData(prev => ({
        ...prev,
        priceNGN: prev.pv * DEFAULT_PV_RATES.NGN,
        priceGHS: prev.pv * DEFAULT_PV_RATES.GHS
      }));
    }
  }, [formData.pv, autoCalculate]);

  // Clear Redux error when component mounts or form data changes
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [formData, dispatch]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required';
    }

    if (formData.pv <= 0) {
      newErrors.pv = 'PV must be greater than 0';
    }

    if (formData.priceNGN <= 0) {
      newErrors.priceNGN = 'Nigerian Naira price must be greater than 0';
    }

    if (formData.priceGHS <= 0) {
      newErrors.priceGHS = 'Ghanaian Cedi price must be greater than 0';
    }

    if (formData.bottles <= 0) {
      newErrors.bottles = 'Number of bottles must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };

    try {
      if (initialData) {
        // Update existing package
        const result = await dispatch(updatePackage({ 
          id: initialData.id, 
          data: submitData 
        })).unwrap();
        
        if (result) {
          onSuccess?.();
        }
      } else {
        // Create new package
        const result = await dispatch(createPackage(submitData)).unwrap();
        
        if (result) {
          onSuccess?.();
        }
      }
    } catch (error) {
      // Error is handled by Redux state
      console.error('Failed to save package:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display Redux error if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Package Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter package name"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter package description"
            disabled={loading}
          />
        </div>

        <Select
          label="Package Type"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          options={PACKAGE_TYPES}
          required
          disabled={loading}
        />

        <div>
          <Input
            label="Number of Bottles"
            type="number"
            value={formData.bottles}
            onChange={(e) => handleInputChange('bottles', parseInt(e.target.value) || 0)}
            error={errors.bottles}
            required
            min="1"
            disabled={loading}
          />
        </div>

        <div>
          <Input
            label="PV (Point Value)"
            type="number"
            value={formData.pv}
            onChange={(e) => handleInputChange('pv', parseInt(e.target.value) || 0)}
            error={errors.pv}
            required
            min="1"
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Toggle
            label="Auto-calculate prices from PV"
            checked={autoCalculate}
            onChange={setAutoCalculate}
            disabled={loading}
          />
        </div>

        <div>
          <Input
            label="Price ($)"
            type="number"
            value={formData.priceNGN}
            onChange={(e) => handleInputChange('priceNGN', parseInt(e.target.value) || 0)}
            error={errors.priceNGN}
            required
            min="1"
            disabled={autoCalculate || loading}
          />
        </div>
      </div>
      <div>
        <Toggle
          label="Package is active"
          checked={formData.status === 'active'}
          onChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
          disabled={loading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {initialData ? 'Update Package' : 'Create Package'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}