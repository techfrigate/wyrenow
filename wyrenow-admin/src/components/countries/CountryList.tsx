import React, { useEffect, useState, useMemo } from "react";
import { Edit, Plus, Map, Globe } from "lucide-react";
import { Country } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchCountries,
  createCountry,
  updateCountry,
} from "../../store/slices/countrySlice";
import { Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CountryForm } from "./CountryForm";
import { RegionManager } from "./RegionManager";
import { Modal } from "../ui/Modal";
import { COUNTRY_PRESETS } from "../../utils/constants";

interface EnhancedTableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'dropdown';
  filterOptions?: { value: string; label: string }[];
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

export function CountryList() {
  const dispatch = useAppDispatch();
  const { countries, loading, error } = useAppSelector(
    (state) => state.countries
  );
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [showRegions, setShowRegions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    currency: "",
    crossCountryCapPercentage: "",
  });

  useEffect(() => {
    console.log("CountryList: Dispatching fetchCountries...");
    dispatch(fetchCountries());
  }, [dispatch]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const nameMatch = !filters.name || 
        country.name.toLowerCase().includes(filters.name.toLowerCase()) ||
        country.code.toLowerCase().includes(filters.name.toLowerCase());
      
      const statusMatch = !filters.status || 
        country.status.toLowerCase() === filters.status.toLowerCase();
      
      const currencyMatch = !filters.currency || 
        country.currency.toLowerCase().includes(filters.currency.toLowerCase()) ||
        country.currencySymbol.toLowerCase().includes(filters.currency.toLowerCase());
      
      const capMatch = !filters.crossCountryCapPercentage || 
        country.crossCountryCapPercentage.toString().includes(filters.crossCountryCapPercentage);

      return nameMatch && statusMatch && currencyMatch && capMatch;
    });
  }, [countries, filters]);

  // Handle filter changes
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      status: "",
      currency: "",
      crossCountryCapPercentage: "",
    });
  };

  const handleEdit = (country: Country) => {
    console.log("CountryList: Editing country:", country.name);
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleManageRegions = (country: Country) => {
    console.log("CountryList: Managing regions for country:", country.name);
    setSelectedCountry(country);
    setShowRegions(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("CountryList: Form submitted with data:", data);

      if (editingCountry) {
        // For updates, use the updateCountry action
        console.log("CountryList: Updating existing country");
        const resultAction = await dispatch(
          updateCountry({ id: editingCountry.id, data })
        );

        if (updateCountry.fulfilled.match(resultAction)) {
          console.log("Country updated successfully");
          setShowForm(false);
          setEditingCountry(null);
        } else {
          console.error("Country update failed:", resultAction.payload);
          throw new Error(
            (resultAction.payload as string) || "Failed to update country"
          );
        }
      } else {
        // For new countries, use the createCountry action
        console.log("CountryList: Creating new country");
        const resultAction = await dispatch(createCountry(data));

        if (createCountry.fulfilled.match(resultAction)) {
          console.log("Country created successfully");
          setShowForm(false);
          setEditingCountry(null);
        } else {
          console.error("Country creation failed:", resultAction.payload);
          throw new Error(
            (resultAction.payload as string) || "Failed to create country"
          );
        }
      }
    } catch (error) {
      console.error("Failed to save country:", error);
      // The error will be handled by the form component
    }
  };

  const handleAddPreset = async (presetName: string) => {
    const preset = COUNTRY_PRESETS[presetName as keyof typeof COUNTRY_PRESETS];
    if (!preset) {
      console.error("Preset not found:", presetName);
      return;
    }

    try {
      console.log("CountryList: Adding preset country:", presetName);

      // Updated to use new schema field names
      const presetData = {
        name: preset.name,
        code: preset.code,
        currency: preset.currency,
        currency_symbol: preset.currencySymbol,
        product_pv_rate: preset.productPvRate || 1200.0,
        bonus_pv_rate: preset.bonusPvRate || 525.0,
        platform_margin: preset.platformMargin || 2000.0,
        cross_country_cap_percentage: preset.crossCountryCapPercentage || 30.0,
        status: "active",
        regions: preset.regions.map((regionName) => ({
          name: regionName,
          code: regionName.substring(0, 2).toUpperCase(),
          status: "active",
        })),
      };

      const resultAction = await dispatch(createCountry(presetData));

      if (createCountry.fulfilled.match(resultAction)) {
        console.log("Preset country added successfully");
      } else {
        console.error("Preset country creation failed:", resultAction.payload);
        alert(`Failed to add ${presetName}. Please try again.`);
      }
    } catch (error) {
      console.error("Failed to add preset country:", error);
      alert(`Failed to add ${presetName}. Please try again.`);
    }
  };

  const columns: EnhancedTableColumn<Country>[] = [
    {
      key: "name",
      title: "Country",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterValue: filters.name,
      onFilterChange: (value) => handleFilterChange("name", value),
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "currency",
      title: "Currency",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterValue: filters.currency,
      onFilterChange: (value) => handleFilterChange("currency", value),
      render: (value, row) => (
        <div>
          <div className="font-medium">{row.currencySymbol}</div>
          <div className="text-sm text-gray-500">{value}</div>
        </div>
      ),
    },
    {
      key: "productPvRate",
      title: "PV Rates",
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            Product: {row.currencySymbol}
            {row.productPvRate}
          </div>
          <div className="text-gray-600">
            Bonus: {row.currencySymbol}
            {row.bonusPvRate}
          </div>
          <div className="text-gray-500 text-xs">
            Margin: {row.currencySymbol}
            {row.platformMargin}
          </div>
        </div>
      ),
    },
    {
      key: "crossCountryCapPercentage",
      title: "Cross-Country Cap",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterValue: filters.crossCountryCapPercentage,
      onFilterChange: (value) => handleFilterChange("crossCountryCapPercentage", value),
      render: (value) => <span className="font-mono text-sm">{value}%</span>,
    },
    {
      key: "regions",
      title: "Regions",
      render: (value) => (
        <span className="text-center font-medium">{value?.length || 0}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      filterType: "dropdown",
      filterOptions: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ],
      filterValue: filters.status,
      onFilterChange: (value) => handleFilterChange("status", value),
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "180px",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleManageRegions(row)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Manage Regions"
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit Country"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Country Management
          </h1>
          <p className="text-gray-600">
            Manage countries, regions, and PV rates for your MLM system
          </p>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              Error: {error}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <Button variant="secondary">Add Preset Country</Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => handleAddPreset("Nigeria")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  🇳🇬 Nigeria (with 37 states)
                </button>
                <button
                  onClick={() => handleAddPreset("Ghana")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  🇬🇭 Ghana (with 16 regions)
                </button>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Countries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {hasActiveFilters ? `${filteredCountries.length}/${countries.length}` : countries.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Map className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Regions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredCountries.reduce(
                  (total, country) => total + (country.regions?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Countries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  filteredCountries.filter((country) => country.status === "active")
                    .length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Country Table */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Countries & PV Rates
          </h2>
          <p className="text-sm text-gray-500">
            Manage product rates, bonus rates, and platform margins
          </p>
        </div>
        <Table data={filteredCountries} columns={columns} loading={loading} />
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCountry(null);
        }}
        title={editingCountry ? "Edit Country" : "Add New Country"}
        size="lg"
      >
        <CountryForm
          initialData={editingCountry}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCountry(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegions}
        onClose={() => setShowRegions(false)}
        title={`Manage Regions - ${selectedCountry?.name}`}
        size="xl"
      >
        {selectedCountry && (
          <RegionManager
            country={selectedCountry}
            onClose={() => setShowRegions(false)}
            onRegionsUpdated={() => {
              console.log(
                "CountryList: Regions updated, refreshing countries..."
              );
              dispatch(fetchCountries());
            }}
          />
        )}
      </Modal>
    </div>
  );
}