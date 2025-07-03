import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Country, Region, TableColumn } from '../../types';
import { apiClient } from '../../utils/api';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { Modal } from '../ui/Modal';

interface RegionManagerProps {
  country: Country;
  onClose: () => void;
  onRegionsUpdated: () => void;
}

export function RegionManager({ country, onClose, onRegionsUpdated }: RegionManagerProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load regions when component mounts or country changes
  useEffect(() => {
    loadRegions();
  }, [country.id]);

  // Function to load regions from API
  const loadRegions = async () => {
    setLoading(true);
    try {
      const fetchedRegions = await apiClient.getCountryRegions(country.id);
      setRegions(fetchedRegions);
    } catch (error) {
      console.error('Failed to load regions:', error);
      // Fall back to country.regions if API fails
      if (country.regions) {
        setRegions(country.regions);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      code: region.code,
      status: region.status
    });
    setShowForm(true);
  };

  const handleDelete = async (region: Region) => {
    if (window.confirm(`Are you sure you want to delete "${region.name}"?`)) {
      try {
        await apiClient.deleteRegion(region.id);
        
        // Reload regions from API after deletion
        await loadRegions();
        
        // Notify parent component
        onRegionsUpdated();
        
      } catch (error) {
        console.error('Failed to delete region:', error);
        alert('Failed to delete region. Please try again.');
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Region code is required';
    } else if (formData.code.length > 10) {
      newErrors.code = 'Region code must be 10 characters or less';
    }
    
    // Check for duplicate region names (excluding current region when editing)
    const duplicateRegion = regions.find(r => 
      r.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!editingRegion || r.id !== editingRegion.id)
    );
    if (duplicateRegion) {
      newErrors.name = 'A region with this name already exists';
    }
    
    // Check for duplicate region codes (excluding current region when editing)
    const duplicateCode = regions.find(r => 
      r.code.toLowerCase() === formData.code.trim().toLowerCase() && 
      (!editingRegion || r.id !== editingRegion.id)
    );
    if (duplicateCode) {
      newErrors.code = 'A region with this code already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const regionData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        status: formData.status
      };

      if (editingRegion) {
        await apiClient.updateRegion(editingRegion.id, regionData);
      } else {
        await apiClient.createRegion(country.id, regionData);
      }
      
      // Reload regions from API after create/update
      await loadRegions();
      
      // Reset form and close modal
      setShowForm(false);
      setEditingRegion(null);
      setFormData({ name: '', code: '', status: 'active' });
      setErrors({});
      
      // Notify parent component
      onRegionsUpdated();
    } catch (error) {
      console.error('Failed to save region:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save region. Please try again.';
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRegion(null);
    setFormData({ name: '', code: '', status: 'active' });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const columns: TableColumn<Region>[] = [
    {
      key: 'name',
      title: 'Region Name',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'code',
      title: 'Code',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
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
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit Region"
            disabled={loading}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Region"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Regions in {country.name}</h3>
          <p className="text-sm text-gray-600">
            {regions.length} {regions.length === 1 ? 'region' : 'regions'} configured
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={loadRegions}
            disabled={loading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Region
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table
          data={regions}
          columns={columns}
          loading={loading}
          emptyMessage={`No regions configured for ${country.name}`}
        />
      </div>

      {/* Region Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingRegion ? 'Edit Region' : 'Add New Region'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Region Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter region name"
            disabled={isSubmitting}
          />

          <Input
            label="Region Code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            error={errors.code}
            required
            placeholder="Enter region code"
            maxLength={10}
            disabled={isSubmitting}
            helperText="Short code to identify this region (max 10 characters)"
          />

          <Toggle
            label="Region is active"
            checked={formData.status === 'active'}
            onChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
            disabled={isSubmitting}
          />

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleFormCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Saving...' 
                : editingRegion 
                  ? 'Update Region' 
                  : 'Add Region'
              }
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}