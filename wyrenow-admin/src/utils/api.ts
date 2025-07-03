import { Package, Country, Region, DashboardStats } from "../types";

class ApiClient {
  private baseUrl = "http://localhost:3000/api";

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Helper function to transform region data consistently
  private transformRegion(region: any, countryId: string): Region {
    return {
      id: region.id.toString(),
      name: region.name,
      code: region.code,
      status: region.status,
      countryId: countryId,
      createdAt: new Date(region.created_at || Date.now()),
      updatedAt: new Date(region.updated_at || Date.now()),
    };
  }

  // Helper function to transform regions array consistently
  private transformRegions(regions: any, countryId: string): Region[] {
    if (!regions) return [];
    
    // Handle different region data formats
    let regionArray = regions;
    
    // If regions is a string, parse it as JSON
    if (typeof regions === 'string') {
      try {
        regionArray = JSON.parse(regions);
      } catch (e) {
        console.error('Failed to parse regions JSON:', e);
        return [];
      }
    }
    
    // If it's not an array, return empty array
    if (!Array.isArray(regionArray)) {
      return [];
    }
    
    return regionArray.map((region: any) => this.transformRegion(region, countryId));
  }

  // Helper function to transform country data consistently  
  private transformCountry(countryData: any): Country {
    return {
      id: countryData.id.toString(),
      name: countryData.name,
      code: countryData.code,
      currency: countryData.currency,
      currencySymbol: countryData.currency_symbol,
      productPvRate: countryData.product_pv_rate,
      bonusPvRate: countryData.bonus_pv_rate,
      platformMargin: countryData.platform_margin,
      crossCountryCapPercentage: countryData.cross_country_cap_percentage,
      status: countryData.status,
      regions: this.transformRegions(countryData.regions, countryData.id.toString()),
      createdAt: new Date(countryData.created_at || Date.now()),
      updatedAt: new Date(countryData.updated_at || Date.now()),
    };
  }

  // Mock data for packages (keeping packages as mock for now)
  private mockPackages: Package[] = [
    {
      id: "1",
      name: "Starter Pack",
      description: "Perfect for beginners starting their wellness journey",
      pv: 15,
      priceNGN: 7875,
      priceGHS: 180,
      bottles: 2,
      type: "standard",
      status: "active",
      features: ["2 Premium Bottles", "Starter Guide", "Basic Support"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Professional Pack",
      description: "Ideal for serious health enthusiasts",
      pv: 30,
      priceNGN: 15750,
      priceGHS: 360,
      bottles: 4,
      type: "premium",
      status: "active",
      features: [
        "4 Premium Bottles",
        "Professional Guide",
        "Priority Support",
        "Monthly Consultation",
      ],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      name: "Elite Pack",
      description: "Complete wellness solution for optimal results",
      pv: 60,
      priceNGN: 31500,
      priceGHS: 720,
      bottles: 8,
      type: "enterprise",
      status: "active",
      features: [
        "8 Premium Bottles",
        "Elite Guide",
        "VIP Support",
        "Weekly Consultation",
        "Custom Meal Plan",
      ],
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-25"),
    },
  ];

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      totalPackages: this.mockPackages.length,
      activePackages: this.mockPackages.filter((p) => p.status === "active")
        .length,
      totalCountries: 2, // Will be dynamic when we get real data
      totalRegions: 6, // Will be dynamic when we get real data
      recentActivity: [
        {
          id: "1",
          type: "package_created",
          description: 'New package "Elite Pack" created',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          adminName: "System Administrator",
        },
        {
          id: "2",
          type: "country_created",
          description: "Nigeria country configuration updated",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          adminName: "System Administrator",
        },
      ],
    };
  }

  // Package API (keeping mock for packages)
  async getPackages(): Promise<Package[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.mockPackages];
  }

  async getPackage(id: string): Promise<Package | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockPackages.find((p) => p.id === id) || null;
  }

  async createPackage(
    packageData: Omit<Package, "id" | "createdAt" | "updatedAt">
  ): Promise<Package> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPackage: Package = {
      ...packageData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockPackages.push(newPackage);
    return newPackage;
  }

  async updatePackage(
    id: string,
    packageData: Partial<Package>
  ): Promise<Package> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockPackages.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Package not found");

    this.mockPackages[index] = {
      ...this.mockPackages[index],
      ...packageData,
      updatedAt: new Date(),
    };

    return this.mockPackages[index];
  }

  async deletePackage(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = this.mockPackages.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Package not found");

    this.mockPackages.splice(index, 1);
  }

  // Country API - Real API implementations
  async getCountries(): Promise<Country[]> {
    try {

      const response = await fetch(`${this.baseUrl}/countries`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch countries:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.data || !result.data.countries) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      // Transform API response to match our Country interface
      const countries: Country[] = result.data.countries.map((country: any) => 
        this.transformCountry(country)
      );

      return countries;
    } catch (error) {
      console.error("API Client Error fetching countries:", error);
      throw error;
    }
  }

  async getCountry(id: string): Promise<Country | null> {
    try {

      const response = await fetch(`${this.baseUrl}/countries/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        console.error("Failed to fetch country:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.data) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      const country = this.transformCountry(result.data);
      return country;
    } catch (error) {
      console.error("API Client Error fetching country:", error);
      throw error;
    }
  }

  async createCountry(countryData: any): Promise<Country> {
    try {

      const response = await fetch(`${this.baseUrl}/countries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(countryData),
      });

      // Check if response is ok
      if (!response.ok) {
        console.error("Response not ok:", response.status, response.statusText);

        // Try to get error text first
        const errorText = await response.text();
        console.error("Error response text:", errorText);

        // Try to parse as JSON if possible
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If not JSON, use the text as error message
          throw new Error(
            `HTTP ${response.status}: ${errorText || response.statusText}`
          );
        }

        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Empty response from server");
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Response text:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      if (!result.data) {
        console.error("No data field in response:", result);
        throw new Error("Invalid response format from server");
      }

      const country = this.transformCountry(result.data);
      return country;
    } catch (error) {
      console.error("API Client Error:", error);
      throw error;
    }
  }

  async updateCountry(
    id: string,
    countryData: Partial<Country>
  ): Promise<Country> {
    try {
      const apiData: any = {};
      if (countryData.name !== undefined) apiData.name = countryData.name;
      if (countryData.code !== undefined) apiData.code = countryData.code;
      if (countryData.currency !== undefined)
        apiData.currency = countryData.currency;
      if (countryData.currencySymbol !== undefined)
        apiData.currency_symbol = countryData.currencySymbol;
      if (countryData.productPvRate !== undefined)
        apiData.product_pv_rate = countryData.productPvRate;
      if (countryData.bonusPvRate !== undefined)
        apiData.bonus_pv_rate = countryData.bonusPvRate;
      if (countryData.platformMargin !== undefined)
        apiData.platform_margin = countryData.platformMargin;
      if (countryData.crossCountryCapPercentage !== undefined)
        apiData.cross_country_cap_percentage =
          countryData.crossCountryCapPercentage;
      if (countryData.status !== undefined) apiData.status = countryData.status;

      const response = await fetch(`${this.baseUrl}/countries/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update country:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `HTTP ${response.status}: ${errorText || response.statusText}`
          );
        }
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.data) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      // Transform API response back to our Country interface
      const updatedCountry: Country = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        currency: result.data.currency,
        currencySymbol: result.data.currency_symbol,
        productPvRate: result.data.product_pv_rate,
        bonusPvRate: result.data.bonus_pv_rate,
        platformMargin: result.data.platform_margin,
        crossCountryCapPercentage: result.data.cross_country_cap_percentage,
        status: result.data.status,
        regions: [], // Regions would need to be fetched separately or included in response
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

      return updatedCountry;
    } catch (error) {
      console.error("API Client Error updating country:", error);
      throw error;
    }
  }

  async deleteCountry(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/countries/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete country:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error("API Client Error deleting country:", error);
      throw error;
    }
  }

  
  // MISSING: Get regions for a specific country
  async getCountryRegions(countryId: string): Promise<Region[]> {
    try {

      const response = await fetch(`${this.baseUrl}/countries/${countryId}/regions`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch regions:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.data) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      const regions = result.data.map((region: any) => 
        this.transformRegion(region, countryId)
      );

      return regions;
    } catch (error) {
      console.error("API Client Error fetching regions:", error);
      throw error;
    }
  }

  // MISSING: Get single region by ID
  async getRegion(regionId: string): Promise<Region | null> {
    try {

      const response = await fetch(`${this.baseUrl}/countries/regions/${regionId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        console.error("Failed to fetch region:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.data) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      const region = this.transformRegion(result.data, result.data.country_id.toString());
      return region;
    } catch (error) {
      console.error("API Client Error fetching region:", error);
      throw error;
    }
  }

  async createRegion(
    countryId: string,
    regionData: Omit<Region, "id" | "countryId" | "createdAt" | "updatedAt">
  ): Promise<Region> {
    try {

      const response = await fetch(
        `${this.baseUrl}/countries/${countryId}/regions`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(regionData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create region:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `HTTP ${response.status}: ${errorText || response.statusText}`
          );
        }
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.data) {
        throw new Error("Invalid response format from server");
      }

      const region = this.transformRegion(result.data, countryId);
      return region;
    } catch (error) {
      console.error("API Client Error creating region:", error);
      throw error;
    }
  }

  async updateRegion(
    regionId: string,
    regionData: Partial<Region>
  ): Promise<Region> {
    try {
      const apiData: any = {};
      if (regionData.name !== undefined) apiData.name = regionData.name;
      if (regionData.code !== undefined) apiData.code = regionData.code;
      if (regionData.status !== undefined) apiData.status = regionData.status;

      const response = await fetch(
        `${this.baseUrl}/countries/regions/${regionId}`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update region:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `HTTP ${response.status}: ${errorText || response.statusText}`
          );
        }
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.data) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid response format from server");
      }

      const updatedRegion = this.transformRegion(result.data, result.data.country_id.toString());
      return updatedRegion;
    } catch (error) {
      console.error("API Client Error updating region:", error);
      throw error;
    }
  }

  async deleteRegion(regionId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/countries/regions/${regionId}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete region:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error("API Client Error deleting region:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();