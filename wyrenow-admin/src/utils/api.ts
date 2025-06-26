import { Package, Country, Region, DashboardStats } from '../types';

class ApiClient {
  private baseUrl = 'http://localhost:3000/api';
  
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Mock data for development
  private mockPackages: Package[] = [
    {
      id: '1',
      name: 'Starter Pack',
      description: 'Perfect for beginners starting their wellness journey',
      pv: 15,
      priceNGN: 7875,
      priceGHS: 180,
      bottles: 2,
      type: 'standard',
      status: 'active',
      features: ['2 Premium Bottles', 'Starter Guide', 'Basic Support'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Professional Pack',
      description: 'Ideal for serious health enthusiasts',
      pv: 30,
      priceNGN: 15750,
      priceGHS: 360,
      bottles: 4,
      type: 'premium',
      status: 'active',
      features: ['4 Premium Bottles', 'Professional Guide', 'Priority Support', 'Monthly Consultation'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Elite Pack',
      description: 'Complete wellness solution for optimal results',
      pv: 60,
      priceNGN: 31500,
      priceGHS: 720,
      bottles: 8,
      type: 'enterprise',
      status: 'active',
      features: ['8 Premium Bottles', 'Elite Guide', 'VIP Support', 'Weekly Consultation', 'Custom Meal Plan'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25')
    }
  ];

  private mockCountries: Country[] = [
    {
      id: '1',
      name: 'Nigeria',
      code: 'NG',
      currency: 'Nigerian Naira',
      currencySymbol: '₦',
      pvRate: 525,
      status: 'active',
      regions: [
        { id: '1', name: 'Lagos', code: 'LA', countryId: '1', status: 'active', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Abuja (FCT)', code: 'FC', countryId: '1', status: 'active', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Kano', code: 'KN', countryId: '1', status: 'active', createdAt: new Date(), updatedAt: new Date() }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Ghana',
      code: 'GH',
      currency: 'Ghanaian Cedi',
      currencySymbol: 'GH₵',
      pvRate: 12,
      status: 'active',
      regions: [
        { id: '4', name: 'Greater Accra', code: 'GA', countryId: '2', status: 'active', createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'Ashanti', code: 'AS', countryId: '2', status: 'active', createdAt: new Date(), updatedAt: new Date() },
        { id: '6', name: 'Northern', code: 'NR', countryId: '2', status: 'active', createdAt: new Date(), updatedAt: new Date() }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalPackages: this.mockPackages.length,
      activePackages: this.mockPackages.filter(p => p.status === 'active').length,
      totalCountries: this.mockCountries.length,
      totalRegions: this.mockCountries.reduce((sum, country) => sum + country.regions.length, 0),
      recentActivity: [
        {
          id: '1',
          type: 'package_created',
          description: 'New package "Elite Pack" created',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          adminName: 'System Administrator'
        },
        {
          id: '2',
          type: 'country_created',
          description: 'Nigeria country configuration updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          adminName: 'System Administrator'
        }
      ]
    };
  }

  // Package API
  async getPackages(): Promise<Package[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.mockPackages];
  }

  async getPackage(id: string): Promise<Package | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockPackages.find(p => p.id === id) || null;
  }

  async createPackage(packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPackage: Package = {
      ...packageData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockPackages.push(newPackage);
    return newPackage;
  }

  async updatePackage(id: string, packageData: Partial<Package>): Promise<Package> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.mockPackages.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Package not found');
    
    this.mockPackages[index] = {
      ...this.mockPackages[index],
      ...packageData,
      updatedAt: new Date()
    };
    
    return this.mockPackages[index];
  }

  async deletePackage(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.mockPackages.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Package not found');
    
    this.mockPackages.splice(index, 1);
  }

  // Country API
  async getCountries(): Promise<Country[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.mockCountries];
  }

  async getCountry(id: string): Promise<Country | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockCountries.find(c => c.id === id) || null;
  }


   async createCountry(countryData: any): Promise<Country> {
    try {

      const response = await fetch(`${this.baseUrl}/countries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countryData)
      });
    
      // Check if response is ok
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        
        // Try to get error text first
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        // Try to parse as JSON if possible
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If not JSON, use the text as error message
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const responseText = await response.text();
            if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
            if (!result.data) {
        console.error('No data field in response:', result);
        throw new Error('Invalid response format from server');
      }
      
      const country: Country = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        currencySymbol: result.data.currency_symbol,
        pvRate: result.data.pv_rate,
        status: result.data.status,
        regions: [],
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now())
      };
      
      return country;
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async updateCountry(id: string, countryData: Partial<Country>): Promise<Country> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.mockCountries.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Country not found');
    
    this.mockCountries[index] = {
      ...this.mockCountries[index],
      ...countryData,
      updatedAt: new Date()
    };
    
    return this.mockCountries[index];
  }

  async deleteCountry(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.mockCountries.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Country not found');
    
    this.mockCountries.splice(index, 1);
  }

  // Region API
  async createRegion(countryId: string, regionData: Omit<Region, 'id' | 'countryId' | 'createdAt' | 'updatedAt'>): Promise<Region> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const country = this.mockCountries.find(c => c.id === countryId);
    if (!country) throw new Error('Country not found');
    
    const newRegion: Region = {
      ...regionData,
      id: Date.now().toString(),
      countryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    country.regions.push(newRegion);
    return newRegion;
  }

  async updateRegion(regionId: string, regionData: Partial<Region>): Promise<Region> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (const country of this.mockCountries) {
      const regionIndex = country.regions.findIndex(r => r.id === regionId);
      if (regionIndex !== -1) {
        country.regions[regionIndex] = {
          ...country.regions[regionIndex],
          ...regionData,
          updatedAt: new Date()
        };
        return country.regions[regionIndex];
      }
    }
    
    throw new Error('Region not found');
  }

  async deleteRegion(regionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const country of this.mockCountries) {
      const regionIndex = country.regions.findIndex(r => r.id === regionId);
      if (regionIndex !== -1) {
        country.regions.splice(regionIndex, 1);
        return;
      }
    }
    
    throw new Error('Region not found');
  }
}

export const apiClient = new ApiClient();