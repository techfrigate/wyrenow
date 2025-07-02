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
      console.log("Fetching countries from API...");

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
      const countries: Country[] = result.data.countries.map(
        (country: any) => ({
          id: country.id.toString(),
          name: country.name,
          code: country.code,
          currency: country.currency,
          currencySymbol: country.currency_symbol,
          // Updated for new schema
          productPvRate: country.product_pv_rate,
          bonusPvRate: country.bonus_pv_rate,
          platformMargin: country.platform_margin,
          crossCountryCapPercentage: country.cross_country_cap_percentage,
          status: country.status,
          regions: country.regions
            ? country.regions.map((region: any) => ({
                id: region.id.toString(),
                name: region.name,
                code: region.code,
                status: region.status,
                countryId: country.id.toString(),
                createdAt: new Date(region.created_at || Date.now()),
                updatedAt: new Date(region.updated_at || Date.now()),
              }))
            : [],
          createdAt: new Date(country.created_at || Date.now()),
          updatedAt: new Date(country.updated_at || Date.now()),
        })
      );

      console.log(`Successfully fetched ${countries.length} countries`);
      return countries;
    } catch (error) {
      console.error("API Client Error fetching countries:", error);
      throw error;
    }
  }

  async getCountry(id: string): Promise<Country | null> {
    try {
      console.log(`Fetching country with ID: ${id}`);

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

      // Transform API response to match our Country interface
      const country: Country = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        currency: result.data.currency,
        currencySymbol: result.data.currency_symbol,
        // Updated for new schema
        productPvRate: result.data.product_pv_rate,
        bonusPvRate: result.data.bonus_pv_rate,
        platformMargin: result.data.platform_margin,
        crossCountryCapPercentage: result.data.cross_country_cap_percentage,
        status: result.data.status,
        regions: result.data.regions
          ? JSON.parse(result.data.regions).map((region: any) => ({
              id: region.id.toString(),
              name: region.name,
              code: region.code,
              status: region.status,
              countryId: result.data.id.toString(),
              createdAt: new Date(region.created_at || Date.now()),
              updatedAt: new Date(region.updated_at || Date.now()),
            }))
          : [],
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

      console.log("Successfully fetched country:", country.name);
      return country;
    } catch (error) {
      console.error("API Client Error fetching country:", error);
      throw error;
    }
  }

  // Keep createCountry exactly as it was but update field mappings
  async createCountry(countryData: any): Promise<Country> {
    try {
      console.log("API Client creating country:", countryData);

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

      // Transform the API response to match our Country interface
      const country: Country = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        currency: result.data.currency,
        currencySymbol: result.data.currency_symbol,
        // Updated for new schema
        productPvRate: result.data.product_pv_rate,
        bonusPvRate: result.data.bonus_pv_rate,
        platformMargin: result.data.platform_margin,
        crossCountryCapPercentage: result.data.cross_country_cap_percentage,
        status: result.data.status,
        regions: result.data.regions
          ? result.data.regions.map((region: any) => ({
              id: region.id.toString(),
              name: region.name,
              code: region.code,
              status: region.status,
              countryId: result.data.id.toString(),
              createdAt: new Date(region.created_at || Date.now()),
              updatedAt: new Date(region.updated_at || Date.now()),
            }))
          : [],
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

      console.log("Country created successfully:", country);
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
      console.log(`Updating country ${id} with data:`, countryData);

      // Transform our Country interface data to API format
      const apiData: any = {};
      if (countryData.name !== undefined) apiData.name = countryData.name;
      if (countryData.code !== undefined) apiData.code = countryData.code;
      if (countryData.currency !== undefined)
        apiData.currency = countryData.currency;
      if (countryData.currencySymbol !== undefined)
        apiData.currency_symbol = countryData.currencySymbol;
      // Updated for new schema
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
        // Updated for new schema
        productPvRate: result.data.product_pv_rate,
        bonusPvRate: result.data.bonus_pv_rate,
        platformMargin: result.data.platform_margin,
        crossCountryCapPercentage: result.data.cross_country_cap_percentage,
        status: result.data.status,
        regions: [], // Regions would need to be fetched separately or included in response
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

      console.log("Country updated successfully:", updatedCountry);
      return updatedCountry;
    } catch (error) {
      console.error("API Client Error updating country:", error);
      throw error;
    }
  }

  async deleteCountry(id: string): Promise<void> {
    try {
      console.log(`Deleting country with ID: ${id}`);

      const response = await fetch(`${this.baseUrl}/countries/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete country:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log("Country deleted successfully");
    } catch (error) {
      console.error("API Client Error deleting country:", error);
      throw error;
    }
  }

  // Keep createRegion exactly as it was
  async createRegion(
    countryId: string,
    regionData: Omit<Region, "id" | "countryId" | "createdAt" | "updatedAt">
  ): Promise<Region> {
    try {
      const response = await fetch(
        `${this.baseUrl}/countries/${countryId}/regions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(regionData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
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

      const region: Region = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        status: result.data.status,
        countryId: countryId,
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

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
      console.log(`Updating region ${regionId} with data:`, regionData);

      const response = await fetch(
        `${this.baseUrl}/countries/regions/${regionId}`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(regionData),
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

      const updatedRegion: Region = {
        id: result.data.id.toString(),
        name: result.data.name,
        code: result.data.code,
        status: result.data.status,
        countryId: result.data.country_id.toString(),
        createdAt: new Date(result.data.created_at || Date.now()),
        updatedAt: new Date(result.data.updated_at || Date.now()),
      };

      console.log("Region updated successfully:", updatedRegion);
      return updatedRegion;
    } catch (error) {
      console.error("API Client Error updating region:", error);
      throw error;
    }
  }

  async deleteRegion(regionId: string): Promise<void> {
    try {
      console.log(`Deleting region with ID: ${regionId}`);

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

      console.log("Region deleted successfully");
    } catch (error) {
      console.error("API Client Error deleting region:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
