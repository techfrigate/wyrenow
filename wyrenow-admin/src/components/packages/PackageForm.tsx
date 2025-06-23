import React, { useState, useEffect } from 'react';
import { Package } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Toggle } from '../ui/Toggle';
import { PACKAGE_TYPES, DEFAULT_PV_RATES } from '../../utils/constants';

interface PackageFormProps {
  initialData?: Package | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PackageForm({ initialData, onSubmit, onCancel }: PackageFormProps) {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Package Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter package name"
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter package description"
          />
        </div>

        <Select
          label="Package Type"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          options={PACKAGE_TYPES}
          required
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
          />
        </div>

        <div className="flex items-center space-x-4">
          <Toggle
            label="Auto-calculate prices from PV"
            checked={autoCalculate}
            onChange={setAutoCalculate}
          />
        </div>

        <div>
          <Input
            label="Price in Nigerian Naira (₦)"
            type="number"
            value={formData.priceNGN}
            onChange={(e) => handleInputChange('priceNGN', parseInt(e.target.value) || 0)}
            error={errors.priceNGN}
            required
            min="1"
            disabled={autoCalculate}
          />
        </div>

        <div>
          <Input
            label="Price in Ghanaian Cedi (GH₵)"
            type="number"
            value={formData.priceGHS}
            onChange={(e) => handleInputChange('priceGHS', parseInt(e.target.value) || 0)}
            error={errors.priceGHS}
            required
            min="1"
            disabled={autoCalculate}
          />
        </div>
      </div>

      {/* Features Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Package Features
        </label>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                className="flex-1"
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addFeature}
          >
            Add Feature
          </Button>
        </div>
      </div>

      {/* Status Toggle */}
      <div>
        <Toggle
          label="Package is active"
          checked={formData.status === 'active'}
          onChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
}