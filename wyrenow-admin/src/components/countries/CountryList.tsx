import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Edit, Map, Globe } from "lucide-react";
import { Country } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchCountries,
  createCountry,
  updateCountry,
} from "../../store/slices/countrySlice";
import { Table } from "../ui/Table";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { CountryForm } from "./CountryForm";
import { RegionManager } from "./RegionManager";
import { Modal } from "../ui/Modal";
import { COUNTRY_PRESETS } from "../../utils/constants";
import { apiClient } from "../../utils/api";

interface EnhancedTableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "dropdown";
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

  const [regionCounts, setRegionCounts] = useState<Record<number, number>>({});

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    currency: "",
    crossCountryCapPercentage: "",
  });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const loadRegionCounts = useCallback(async () => {
    if (!countries.length) return;
    try {
      const counts: Record<number, number> = {};
      await Promise.all(
        countries.map(async (c) => {
          try {
            const regions = await apiClient.getCountryRegions(c.id);
            counts[c.id] = regions.length;
          } catch {
            counts[c.id] = 0;
          }
        })
      );
      setRegionCounts(counts);
    } catch (err) {
      console.error("Failed to load region counts:", err);
    }
  }, [countries]);

  useEffect(() => {
    loadRegionCounts();
  }, [loadRegionCounts]);

  const getRegionCount = (countryId: number) => regionCounts[countryId] ?? 0;

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const nameMatch =
        !filters.name ||
        country.name.toLowerCase().includes(filters.name.toLowerCase()) ||
        country.code.toLowerCase().includes(filters.name.toLowerCase());

      const statusMatch =
        !filters.status ||
        country.status.toLowerCase() === filters.status.toLowerCase();

      const currencyMatch =
        !filters.currency ||
        country.currency
          .toLowerCase()
          .includes(filters.currency.toLowerCase()) ||
        country.currencySymbol
          .toLowerCase()
          .includes(filters.currency.toLowerCase());

      const capMatch =
        !filters.crossCountryCapPercentage ||
        country.crossCountryCapPercentage
          .toString()
          .includes(filters.crossCountryCapPercentage);

      return nameMatch && statusMatch && currencyMatch && capMatch;
    });
  }, [countries, filters]);

  const handleFilterChange = (colKey: string, value: string) =>
    setFilters((p) => ({ ...p, [colKey]: value }));

  const clearFilters = () =>
    setFilters({
      name: "",
      status: "",
      currency: "",
      crossCountryCapPercentage: "",
    });

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleManageRegions = (country: Country) => {
    setSelectedCountry(country);
    setShowRegions(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingCountry) {
        const res = await dispatch(
          updateCountry({ id: editingCountry.id, data })
        );
        if (updateCountry.rejected.match(res)) throw new Error();
      } else {
        const res = await dispatch(createCountry(data));
        if (createCountry.rejected.match(res)) throw new Error();
      }
      setShowForm(false);
      setEditingCountry(null);
    } catch {}
  };

  const handleAddPreset = async (presetName: string) => {
    const preset = COUNTRY_PRESETS[presetName as keyof typeof COUNTRY_PRESETS];
    if (!preset) return;
    const presetData = {
      name: preset.name,
      code: preset.code,
      currency: preset.currency,
      currency_symbol: preset.currencySymbol,
      product_pv_rate: preset.productPvRate || 1200,
      bonus_pv_rate: preset.bonusPvRate || 525,
      platform_margin: preset.platformMargin || 2000,
      cross_country_cap_percentage: preset.crossCountryCapPercentage || 30,
      status: "active",
      regions: preset.regions.map((r) => ({
        name: r,
        code: r.slice(0, 2).toUpperCase(),
        status: "active",
      })),
    };
    await dispatch(createCountry(presetData));
  };

  const handleRegionsUpdated = async () => {
    await dispatch(fetchCountries());
    await loadRegionCounts();
    if (selectedCountry) {
      const updated = countries.find((c) => c.id === selectedCountry.id);
      if (updated) setSelectedCountry(updated);
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
      onFilterChange: (v) => handleFilterChange("name", v),
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
      onFilterChange: (v) => handleFilterChange("currency", v),
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
      render: (_, row) => (
        <div className="text-sm">
          <div className="font-medium">
            Product: {row.currencySymbol}
            {row.productPvRate}
          </div>
          <div>
            Bonus: {row.currencySymbol}
            {row.bonusPvRate}
          </div>
          <div className="text-xs text-gray-500">
            Margin: {row.currencySymbol}
            {row.platformMargin}
          </div>
        </div>
      ),
    },
    {
      key: "crossCountryCapPercentage",
      title: "Cross‑Country Cap",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterValue: filters.crossCountryCapPercentage,
      onFilterChange: (v) => handleFilterChange("crossCountryCapPercentage", v),
      render: (value) => <span className="font-mono text-sm">{value}%</span>,
    },
    {
      key: "regionsCount",
      title: "Regions",
      render: (_, row) => (
        <span className="font-medium text-center">
          {getRegionCount(row.id)}
        </span>
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
        { value: "inactive", label: "Inactive" },
      ],
      filterValue: filters.status,
      onFilterChange: (v) => handleFilterChange("status", v),
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
            disabled={loading}
            title="Manage Regions"
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            disabled={loading}
            title="Edit Country"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Country Management</h1>
          <p className="text-gray-600">
            Manage countries, regions, and PV rates for your MLM system
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 text-sm text-red-600 rounded">
              Error: {error}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <Button variant="secondary" disabled={loading}>
              Add Preset Country
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={() => handleAddPreset("Nigeria")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                disabled={loading}
              >
                🇳🇬 Nigeria (37 states)
              </button>
              <button
                onClick={() => handleAddPreset("Ghana")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                disabled={loading}
              >
                🇬🇭 Ghana (16 regions)
              </button>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Countries</p>
              <p className="text-2xl font-semibold">
                {hasActiveFilters
                  ? `${filteredCountries.length}/${countries.length}`
                  : countries.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Map className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Regions</p>
              <p className="text-2xl font-semibold">
                {Object.values(regionCounts).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              ✓
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Countries</p>
              <p className="text-2xl font-semibold">
                {filteredCountries.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Countries & PV Rates</h2>
              <p className="text-sm text-gray-500">
                Manage product rates, bonus rates, and platform margins
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
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
        title={`Manage Regions – ${selectedCountry?.name}`}
        size="xl"
      >
        {selectedCountry && (
          <RegionManager
            country={selectedCountry}
            onClose={() => setShowRegions(false)}
            onRegionsUpdated={handleRegionsUpdated}
          />
        )}
      </Modal>
    </div>
  );
}
