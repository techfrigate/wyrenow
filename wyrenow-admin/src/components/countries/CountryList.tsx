import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Map, Globe } from 'lucide-react';
import { Country, TableColumn } from '../../types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchCountries, createCountry, updateCountry, deleteCountry } from '../../store/slices/countrySlice';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CountryForm } from './CountryForm';
import { RegionManager } from './RegionManager';
import { Modal } from '../ui/Modal';
import { COUNTRY_PRESETS } from '../../utils/constants';

export function CountryList() {
  const dispatch = useAppDispatch();
  const { countries, loading } = useAppSelector((state) => state.countries);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [showRegions, setShowRegions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleDelete = async (country: Country) => {
    if (window.confirm(`Are you sure you want to delete "${country.name}"?`)) {
      dispatch(deleteCountry(country.id));
    }
  };

  const handleManageRegions = (country: Country) => {
    setSelectedCountry(country);
    setShowRegions(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingCountry) {
        dispatch(updateCountry({ id: editingCountry.id, data }));
      } else {
        dispatch(createCountry(data));
      }
      setShowForm(false);
      setEditingCountry(null);
    } catch (error) {
      console.error('Failed to save country:', error);
    }
  };

  const handleAddPreset = async (presetName: string) => {
    const preset = COUNTRY_PRESETS[presetName as keyof typeof COUNTRY_PRESETS];
    if (!preset) return;

    try {
      dispatch(createCountry({
        name: preset.name,
        code: preset.code,
        currency: preset.currency,
        currencySymbol: preset.currencySymbol,
        pvRate: preset.pvRate,
        status: 'active',
        regions: preset.regions.map(regionName => ({
          name: regionName,
          code: regionName.substring(0, 2).toUpperCase(),
          status: 'active'
        }))
      }));
    } catch (error) {
      console.error('Failed to add preset country:', error);
    }
  };

  const columns: TableColumn<Country>[] = [
    {
      key: 'name',
      title: 'Country',
      sortable: true,
      filterable: true,
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
      )
    },
    {
      key: 'currency',
      title: 'Currency',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{row.currencySymbol}</div>
          <div className="text-sm text-gray-500">{value}</div>
        </div>
      )
    },
    {
      key: 'pvRate',
      title: 'PV Rate',
      sortable: true,
      render: (value, row) => (
        <span className="font-mono">1 PV = {row.currencySymbol}{value}</span>
      )
    },
    {
      key: 'regions',
      title: 'Regions',
      render: (value) => (
        <span className="text-center">{value.length}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '150px',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleManageRegions(row)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Manage Regions"
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country Management</h1>
          <p className="text-gray-600">Manage countries and regions for your MLM system</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative group">
            <Button variant="secondary">
              Add Preset Country
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleAddPreset('Nigeria')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Nigeria (with 37 states)
                </button>
                <button
                  onClick={() => handleAddPreset('Ghana')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Ghana (with 16 regions)
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

      {/* Country Table */}
      <Card>
        <Table
          data={countries}
          columns={columns}
          loading={loading}
        />
      </Card>

      {/* Country Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCountry(null);
        }}
        title={editingCountry ? 'Edit Country' : 'Add New Country'}
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

      {/* Region Manager Modal */}
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
            onRegionsUpdated={() => dispatch(fetchCountries())}
          />
        )}
      </Modal>
    </div>
  );
}