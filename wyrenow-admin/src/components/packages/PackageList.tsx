import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Package, TableColumn } from '../../types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchPackages, createPackage, updatePackage, deletePackage } from '../../store/slices/packageSlice';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PackageForm } from './PackageForm';
import { Modal } from '../ui/Modal';
import { CURRENCY_SYMBOLS } from '../../utils/constants';

export function PackageList() {
  const dispatch = useAppDispatch();
  const { packages, loading } = useAppSelector((state) => state.packages);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPackage, setPreviewPackage] = useState<Package | null>(null);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = async (pkg: Package) => {
    if (window.confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
      dispatch(deletePackage(pkg.id));
    }
  };

  const handlePreview = (pkg: Package) => {
    setPreviewPackage(pkg);
    setShowPreview(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPackage) {
        dispatch(updatePackage({ id: editingPackage.id, data }));
      } else {
        dispatch(createPackage(data));
      }
      setShowForm(false);
      setEditingPackage(null);
    } catch (error) {
      console.error('Failed to save package:', error);
    }
  };

  const columns: TableColumn<Package>[] = [
    {
      key: 'name',
      title: 'Package Name',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 capitalize">{row.type}</div>
        </div>
      )
    },
    {
      key: 'pv',
      title: 'PV',
      sortable: true,
      render: (value) => <span className="font-mono font-medium">{value}</span>
    },
    {
      key: 'priceNGN',
      title: 'Price (₦)',
      sortable: true,
      render: (value) => <span className="font-mono">{CURRENCY_SYMBOLS.NGN}{value.toLocaleString()}</span>
    },
    {
      key: 'priceGHS',
      title: 'Price (GH₵)',
      sortable: true,
      render: (value) => <span className="font-mono">{CURRENCY_SYMBOLS.GHS}{value.toLocaleString()}</span>
    },
    {
      key: 'bottles',
      title: 'Bottles',
      sortable: true,
      render: (value) => <span className="text-center">{value}</span>
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
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePreview(row)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
          <p className="text-gray-600">Create and manage MLM packages</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Package
        </Button>
      </div>

      {/* Package Table */}
      <Card>
        <Table
          data={packages}
          columns={columns}
          loading={loading}
        />
      </Card>

      {/* Package Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPackage(null);
        }}
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        size="lg"
      >
        <PackageForm
          initialData={editingPackage}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPackage(null);
          }}
        />
      </Modal>

      {/* Package Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Package Preview"
        size="lg"
      >
        {previewPackage && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold">{previewPackage.name}</h3>
              <p className="text-blue-100 capitalize">{previewPackage.type} Package</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Package Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PV Value:</span>
                    <span className="font-medium">{previewPackage.pv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bottles:</span>
                    <span className="font-medium">{previewPackage.bottles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`capitalize font-medium ${
                      previewPackage.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {previewPackage.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nigerian Naira:</span>
                    <span className="font-medium">{CURRENCY_SYMBOLS.NGN}{previewPackage.priceNGN.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ghanaian Cedi:</span>
                    <span className="font-medium">{CURRENCY_SYMBOLS.GHS}{previewPackage.priceGHS.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {previewPackage.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-600">{previewPackage.description}</p>
              </div>
            )}

            {previewPackage.features && previewPackage.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {previewPackage.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}