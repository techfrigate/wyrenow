import React, { useState, useEffect } from 'react';
import { Country } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { NIGERIAN_STATES, GHANAIAN_REGIONS } from '../../utils/constants';

interface CountryFormProps {
  initialData?: Country | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CountryForm({ initialData, onSubmit, onCancel }: CountryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    currency: '',
    currencySymbol: '',
    pvRate: 1,
    status: 'active'
  });
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [showRegionSelection, setShowRegionSelection] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        currency: initialData.currency,
        currencySymbol: initialData.currencySymbol,
        pvRate: initialData.pvRate,
        status: initialData.status
      });
      setSelectedRegions(initialData.regions.map(r => r.name));
    }
  }, [initialData]);

  useEffect(() => {
    // Auto-detect regions based on country name
    const countryName = formData.name.toLowerCase();
    if (countryName.includes('nigeria')) {
      setAvailableRegions(NIGERIAN_STATES);
      setShowRegionSelection(true);
      if (!initialData) {
        setFormData(prev => ({
          ...prev,
          currency: 'Nigerian Naira',
          currencySymbol: '₦',
          pvRate: 525
        }));
      }
    } else if (countryName.includes('ghana')) {
      setAvailableRegions(GHANAIAN_REGIONS);
      setShowRegionSelection(true);
      if (!initialData) {
        setFormData(prev => ({
          ...prev,
          currency: 'Ghanaian Cedi',
          currencySymbol: 'GH₵',
          pvRate: 12
        }));
      }
    } else {
      setAvailableRegions([]);
      setShowRegionSelection(false);
    }
  }, [formData.name, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegionToggle = (regionName: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionName)) {
        return prev.filter(r => r !== regionName);
      } else {
        return [...prev, regionName];
      }
    });
  };

  const selectAllRegions = () => {
    setSelectedRegions([...availableRegions]);
  };

  const deselectAllRegions = () => {
    setSelectedRegions([]);
  };

  const generateRegionCode = (regionName: string) => {
    // Generate a 2-3 character code from region name
    const words = regionName.split(' ');
    if (words.length > 1) {
      return words.map(word => word.charAt(0)).join('').toUpperCase().substring(0, 3);
    } else {
      return regionName.substring(0, 3).toUpperCase();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Country name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Country code is required';
    } else if (formData.code.length !== 2) {
      newErrors.code = 'Country code must be 2 characters';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency name is required';
    }

    if (!formData.currencySymbol.trim()) {
      newErrors.currencySymbol = 'Currency symbol is required';
    }

    if (formData.pvRate <= 0) {
      newErrors.pvRate = 'PV rate must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      code: formData.code.toUpperCase(),
      regions: selectedRegions.map(regionName => ({
        name: regionName,
        code: generateRegionCode(regionName),
        status: 'active'
      }))
    };

    onSubmit(submitData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Country Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter country name"
          />

          <Input
            label="Country Code (ISO)"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            error={errors.code}
            required
            placeholder="e.g., NG, GH"
            maxLength={2}
          />

          <Input
            label="Currency Name"
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            error={errors.currency}
            required
            placeholder="e.g., Nigerian Naira"
          />

          <Input
            label="Currency Symbol"
            value={formData.currencySymbol}
            onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
            error={errors.currencySymbol}
            required
            placeholder="e.g., ₦, GH₵"
          />

          <div className="md:col-span-2">
            <Input
              label="PV Conversion Rate"
              type="number"
              value={formData.pvRate}
              onChange={(e) => handleInputChange('pvRate', parseFloat(e.target.value) || 0)}
              error={errors.pvRate}
              required
              step="0.01"
              min="0.01"
              helperText="Amount in local currency equal to 1 PV"
            />
          </div>

          <div className="md:col-span-2">
            <Toggle
              label="Country is active"
              checked={formData.status === 'active'}
              onChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
            />
          </div>
        </div>

        {/* Region Selection */}
        {showRegionSelection && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Select Regions/States</h4>
                <p className="text-sm text-gray-500">
                  Choose the regions/states for {formData.name} ({selectedRegions.length} selected)
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={selectAllRegions}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={deselectAllRegions}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableRegions.map((region) => (
                  <label
                    key={region}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() => handleRegionToggle(region)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{region}</span>
                    <span className="text-xs text-gray-400">({generateRegionCode(region)})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

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
            {initialData ? 'Update Country' : 'Create Country'}
          </Button>
        </div>
      </form>
    </div>
  );
}