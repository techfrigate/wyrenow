import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Country } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { createCountry } from '../../store/slices/countrySlice';

// GeoNames API configuration
const GEONAMES_USERNAME = 'dhruvswami'; // Replace with your GeoNames username
const GEONAMES_BASE_URL = 'https://secure.geonames.org'; 

// Currency mapping for common countries (fallback data)
const CURRENCY_MAP = {
  'NG': { currency: 'Nigerian Naira', symbol: '₦', pvRate: 525 },
  'GH': { currency: 'Ghanaian Cedi', symbol: 'GH₵', pvRate: 12 },
  'KE': { currency: 'Kenyan Shilling', symbol: 'KSh', pvRate: 150 },
  'ZA': { currency: 'South African Rand', symbol: 'R', pvRate: 18 },
  'EG': { currency: 'Egyptian Pound', symbol: 'E£', pvRate: 31 },
  'MA': { currency: 'Moroccan Dirham', symbol: 'MAD', pvRate: 10 },
  'UG': { currency: 'Ugandan Shilling', symbol: 'USh', pvRate: 3700 },
  'TZ': { currency: 'Tanzanian Shilling', symbol: 'TSh', pvRate: 2500 },
  'US': { currency: 'US Dollar', symbol: '$', pvRate: 1 },
  'GB': { currency: 'British Pound', symbol: '£', pvRate: 0.8 },
  'CA': { currency: 'Canadian Dollar', symbol: 'C$', pvRate: 1.35 },
  'AU': { currency: 'Australian Dollar', symbol: 'A$', pvRate: 1.5 },
  'IN': { currency: 'Indian Rupee', symbol: '₹', pvRate: 83 },
  'BR': { currency: 'Brazilian Real', symbol: 'R$', pvRate: 5 },
  'MX': { currency: 'Mexican Peso', symbol: '$', pvRate: 17 },
  'CN': { currency: 'Chinese Yuan', symbol: '¥', pvRate: 7 },
  'JP': { currency: 'Japanese Yen', symbol: '¥', pvRate: 150 },
};

// Fallback countries list in case API fails
const FALLBACK_COUNTRIES = [
  { countryCode: 'NG', countryName: 'Nigeria', geonameId: 2328926 },
  { countryCode: 'GH', countryName: 'Ghana', geonameId: 2300660 },
  { countryCode: 'KE', countryName: 'Kenya', geonameId: 192950 },
  { countryCode: 'ZA', countryName: 'South Africa', geonameId: 953987 },
  { countryCode: 'EG', countryName: 'Egypt', geonameId: 357994 },
  { countryCode: 'MA', countryName: 'Morocco', geonameId: 2542007 },
  { countryCode: 'UG', countryName: 'Uganda', geonameId: 226074 },
  { countryCode: 'TZ', countryName: 'Tanzania', geonameId: 149590 },
  { countryCode: 'US', countryName: 'United States', geonameId: 6252001 },
  { countryCode: 'GB', countryName: 'United Kingdom', geonameId: 2635167 },
  { countryCode: 'CA', countryName: 'Canada', geonameId: 6251999 },
  { countryCode: 'AU', countryName: 'Australia', geonameId: 2077456 },
  { countryCode: 'IN', countryName: 'India', geonameId: 1269750 },
  { countryCode: 'BR', countryName: 'Brazil', geonameId: 3469034 },
  { countryCode: 'MX', countryName: 'Mexico', geonameId: 3996063 },
  { countryCode: 'CN', countryName: 'China', geonameId: 1814991 },
  { countryCode: 'JP', countryName: 'Japan', geonameId: 1861060 },
];

interface CountryFormProps {
  initialData?: Country | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface GeoNamesCountry {
  geonameId: number;
  countryName: string;
  countryCode: string;
  isoAlpha3: string;
  fipsCode: string;
  continent: string;
  capital: string;
  areaInSqKm: string;
  population: number;
  currencyCode: string;
  languages: string;
  continentName: string;
}

interface GeoNamesRegion {
  geonameId: number;
  name: string;
  asciiName: string;
  adminCode1: string;
  countryCode: string;
  countryName: string;
  fcode: string;
  population: number;
}

export function CountryForm({ initialData, onSubmit, onCancel }: CountryFormProps) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    currency: '',
    currencySymbol: '',
    pvRate: 1,
    status: 'active'
  });
  
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<GeoNamesRegion[]>([]);
  const [countries, setCountries] = useState<GeoNamesCountry[]>([]);
  const [showRegionSelection, setShowRegionSelection] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('');

  // Helper function to make GeoNames API calls with better error handling
  const makeGeoNamesRequest = async (endpoint: string, params: Record<string, string> = {}) => {
    const username = GEONAMES_USERNAME;
    const url = new URL(`${GEONAMES_BASE_URL}/${endpoint}`);
    url.searchParams.append('username', username);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('Making GeoNames request to:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CountryFormApp/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for GeoNames API specific errors
      if (data.status) {
        throw new Error(`GeoNames API Error: ${data.status.message} (Code: ${data.status.value})`);
      }

      console.log(`Successfully connected with username: ${username}`);
      return data;
    } catch (error) {
      console.error('GeoNames API request failed:', error);
      throw error;
    }
  };

  // Fetch countries from GeoNames API with fallback
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        setApiStatus('Connecting to GeoNames API...');
        
        const data = await makeGeoNamesRequest('countryInfoJSON');
        
        if (data.geonames && data.geonames.length > 0) {
          // Sort countries alphabetically by name
          const sortedCountries = data.geonames.sort((a: GeoNamesCountry, b: GeoNamesCountry) => 
            a.countryName.localeCompare(b.countryName)
          );
          setCountries(sortedCountries);
          setApiStatus('Countries loaded successfully');
          console.log(`Loaded ${sortedCountries.length} countries from GeoNames API`);
        } else {
          throw new Error('No countries returned from API');
        }
      } catch (error) {
        console.error('GeoNames API Error:', error);
        
        // Use fallback countries
        setCountries(FALLBACK_COUNTRIES.sort((a, b) => a.countryName.localeCompare(b.countryName)));
        setApiStatus('Using offline country list (GeoNames API unavailable)');
        
        setErrors(prev => ({ 
          ...prev, 
          api: `GeoNames API Error: ${error.message}. Using fallback country list.`
        }));
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch regions/states for selected country
  const fetchRegions = async (countryCode: string) => {
    try {
      setLoadingRegions(true);
      setApiStatus('Loading regions...');
      
      const countryGeonameId = getCountryGeonameId(countryCode);
      if (!countryGeonameId) {
        console.warn('No geonameId found for country:', countryCode);
        setAvailableRegions([]);
        setShowRegionSelection(false);
        return;
      }

      const data = await makeGeoNamesRequest('childrenJSON', {
        geonameId: countryGeonameId.toString()
      });
      
      if (data.geonames) {
        // Filter for administrative divisions (states/provinces)
        const regions = data.geonames.filter((region: GeoNamesRegion) => 
          region.fcode === 'ADM1' || region.fcode === 'ADMD'
        );
        
        setAvailableRegions(regions);
        setShowRegionSelection(regions.length > 0);
        setApiStatus(`Found ${regions.length} regions for ${countryCode}`);
        console.log(`Loaded ${regions.length} regions for ${countryCode}`);
      } else {
        setAvailableRegions([]);
        setShowRegionSelection(false);
        setApiStatus('No regions found for this country');
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      setAvailableRegions([]);
      setShowRegionSelection(false);
      setApiStatus(`Failed to load regions: ${error.message}`);
      
      setErrors(prev => ({
        ...prev,
        regions: `Could not load regions: ${error.message}`
      }));
    } finally {
      setLoadingRegions(false);
    }
  };

  // Helper function to get country geonameId
  const getCountryGeonameId = (countryCode: string): number => {
    const country = countries.find(c => c.countryCode === countryCode);
    return country ? country.geonameId : 0;
  };

  // Initialize form with existing data
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
      setSelectedRegions(initialData.regions?.map(r => r.name) || []);
      
      // Fetch regions for the existing country
      if (initialData.code) {
        fetchRegions(initialData.code);
      }
    }
  }, [initialData, countries]);

  const handleCountrySelect = async (countryCode: string) => {
    const selectedCountry = countries.find(c => c.countryCode === countryCode);
    
    if (selectedCountry) {
      // Get currency info from our mapping or use GeoNames data
      const currencyInfo = CURRENCY_MAP[countryCode] || {
        currency: selectedCountry.currencyCode || 'Local Currency',
        symbol: selectedCountry.currencyCode || '$',
        pvRate: 1
      };

      setFormData(prev => ({
        ...prev,
        name: selectedCountry.countryName,
        code: selectedCountry.countryCode,
        currency: currencyInfo.currency,
        currencySymbol: currencyInfo.symbol,
        pvRate: currencyInfo.pvRate
      }));

      // Clear selected regions when country changes
      setSelectedRegions([]);
      
      // Fetch regions for the selected country
      await fetchRegions(countryCode);
    }

    // Clear any existing errors for country-related fields
    setErrors(prev => ({
      ...prev,
      name: '',
      code: '',
      currency: '',
      currencySymbol: '',
      api: '',
      regions: ''
    }));
  };

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
    setSelectedRegions(availableRegions.map(region => region.name));
  };

  const deselectAllRegions = () => {
    setSelectedRegions([]);
  };

  const generateRegionCode = (regionName: string, adminCode?: string) => {
    // Use adminCode1 if available, otherwise generate from name
    if (adminCode && adminCode.length <= 3) {
      return adminCode.toUpperCase();
    }
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Ensure all required fields are present and clean
      const submitData = {
        name: formData.name?.trim(),
        code: formData.code?.trim().toUpperCase(),
        currency: formData.currency?.trim(),
        currency_symbol: formData.currencySymbol?.trim(),
        pv_rate: Number(formData.pvRate),
        status: formData.status || 'active',
        // regions: selectedRegions.map(regionName => {
        //   const region = availableRegions.find(r => r.name === regionName);
        //   return {
        //     name: regionName,
        //     code: generateRegionCode(regionName, region?.adminCode1),
        //     status: 'active',
        //     geonameId: region?.geonameId
        //   };
        // })
      };

      if (!submitData.name) {
        throw new Error('Country name is required');
      }
      if (!submitData.code) {
        throw new Error('Country code is required');
      }
      if (!submitData.currency) {
        throw new Error('Currency name is required');
      }
      if (!submitData.currency_symbol) {
        throw new Error('Currency symbol is required');
      }
      if (!submitData.pv_rate || submitData.pv_rate <= 0) {
        throw new Error('Valid PV rate is required');
      }

      console.log('Submitting cleaned country data:', submitData);

      // Use Redux dispatch for creating a new country
      if (!initialData) {
        const resultAction = await dispatch(createCountry(submitData));
        
        if (createCountry.fulfilled.match(resultAction)) {
          console.log('Country created successfully:', resultAction.payload);
          onSubmit(resultAction.payload);
        } else {
          console.error('Country creation failed:', resultAction.payload);
          throw new Error(resultAction.payload as string || 'Failed to create country');
        }
      } else {
        // For updates, call the parent's onSubmit directly
        onSubmit(submitData);
      }
    } catch (error) {
      console.error('Error submitting country:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to save country. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              id="country-select"
              value={formData.code}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className={`
                block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? 'border-red-300' : 'border-gray-300'}
                ${loadingCountries ? 'opacity-50' : ''}
              `}
              required
              disabled={loadingCountries}
            >
              <option value="">
                {loadingCountries ? 'Loading countries...' : 'Select a country'}
              </option>
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryCode}>
                  {country.countryName} ({country.countryCode})
                </option>
              ))}
            </select>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <Input
            label="Country Code (ISO)"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            error={errors.code}
            required
            placeholder="e.g., NG, GH"
            maxLength={2}
            disabled
          />

          <Input
            label="Currency Name"
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            error={errors.currency}
            required
            placeholder="e.g., Nigerian Naira, Ghanaian Cedi"
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

        {/* {showRegionSelection && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Select Regions/States</h4>
                <p className="text-sm text-gray-500">
                  Choose the regions/states for {formData.name} ({selectedRegions.length} selected)
                  {loadingRegions && <span className="ml-2 text-blue-600">Loading regions...</span>}
                </p>
                {errors.regions && (
                  <p className="text-sm text-red-600 mt-1">{errors.regions}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={selectAllRegions}
                  disabled={loadingRegions || availableRegions.length === 0}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={deselectAllRegions}
                  disabled={loadingRegions}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {loadingRegions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading regions...</div>
                </div>
              ) : availableRegions.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">No regions available for this country</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableRegions.map((region) => (
                    <label
                      key={region.geonameId}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region.name)}
                        onChange={() => handleRegionToggle(region.name)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{region.name}</span>
                      <span className="text-xs text-gray-400">
                        ({generateRegionCode(region.name, region.adminCode1)})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )} */}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || loadingCountries}
          >
            {isSubmitting 
              ? 'Saving...' 
              : initialData 
                ? 'Update Country' 
                : 'Create Country'
            }
          </Button>
        </div>
      </form>
    </div>
  );
}