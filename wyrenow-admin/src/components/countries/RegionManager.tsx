import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
  const [regions, setRegions] = useState<Region[]>(country.regions);
  const [showForm, setShowForm] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      await apiClient.deleteRegion(region.id);
      setRegions(regions.filter(r => r.id !== region.id));
      onRegionsUpdated();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Region code is required';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editingRegion) {
        const updatedRegion = await apiClient.updateRegion(editingRegion.id, formData);
        setRegions(regions.map(r => r.id === editingRegion.id ? updatedRegion : r));
      } else {
        const newRegion = await apiClient.createRegion(country.id, formData);
        setRegions([...regions, newRegion]);
      }
      
      setShowForm(false);
      setEditingRegion(null);
      setFormData({ name: '', code: '', status: 'active' });
      onRegionsUpdated();
    } catch (error) {
      console.error('Failed to save region:', error);
    }
  };

  const columns: TableColumn<Region>[] = [
    {
      key: 'name',
      title: 'Region Name',
      sortable: true,
      filterable: true
    },
    {
      key: 'code',
      title: 'Code',
      sortable: true
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
      width: '100px',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Regions in {country.name}</h3>
          <p className="text-sm text-gray-600">{regions.length} regions configured</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Region
        </Button>
      </div>

      <Table
        data={regions}
        columns={columns}
      />

      {/* Region Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRegion(null);
          setFormData({ name: '', code: '', status: 'active' });
        }}
        title={editingRegion ? 'Edit Region' : 'Add New Region'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Region Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
            placeholder="Enter region name"
          />

          <Input
            label="Region Code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            error={errors.code}
            required
            placeholder="Enter region code"
          />

          <Toggle
            label="Region is active"
            checked={formData.status === 'active'}
            onChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
          />

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingRegion(null);
                setFormData({ name: '', code: '', status: 'active' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingRegion ? 'Update Region' : 'Add Region'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}