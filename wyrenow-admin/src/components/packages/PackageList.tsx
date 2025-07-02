import React, { useEffect, useState } from 'react';
import { Edit, Plus, Eye, RefreshCw } from 'lucide-react';
import { Package, TableColumn } from '../../types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { 
  fetchPackages, 
  togglePackageStatus,
  clearError 
} from '../../store/slices/packageSlice';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { PackageForm } from './PackageForm';
import { Modal } from '../ui/Modal';
import { CURRENCY_SYMBOLS } from '../../utils/constants';

export function PackageList() {
  const dispatch = useAppDispatch();
  const { 
    packages, 
    loading, 
    error, 
    totalCount, 
    currentPage, 
    totalPages 
  } = useAppSelector((state) => state.packages);
  
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPackage, setPreviewPackage] = useState<Package | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'DESC' as 'ASC' | 'DESC'
  });

  useEffect(() => {
    dispatch(fetchPackages(filters));
  }, [dispatch, filters]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPackages(filters));
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleToggleStatus = async (pkg: Package) => {
    try {
      await dispatch(togglePackageStatus(pkg.id)).unwrap();
      // No need to refresh as Redux will update the state automatically
    } catch (error) {
      console.error('Failed to toggle package status:', error);
    }
  };

  const handlePreview = (pkg: Package) => {
    setPreviewPackage(pkg);
    setShowPreview(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPackage(null);
    // Refresh the list after successful form submission
    dispatch(fetchPackages(filters));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
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
      render: (value, row) => (
        <div className="flex items-center">
          <Toggle
            label=""
            checked={value === 'active'}
            onChange={(checked) => handleToggleStatus(row)}
            disabled={loading}
          />
          <span className={`ml-2 text-xs font-medium ${
            value === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {value === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
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
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
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
          <p className="text-gray-600">
            Create and manage MLM packages 
            {totalCount > 0 && (
              <span className="ml-2 text-sm">
                ({totalCount} total packages)
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex justify-between items-center">
          <span>{error}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(clearError())}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search packages..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Created Date</option>
                <option value="name">Name</option>
                <option value="pv">PV</option>
                <option value="price_ngn">Price (NGN)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'ASC' | 'DESC')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Package Table */}
      <Card>
        <Table
          data={packages}
          columns={columns}
          loading={loading}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages} ({totalCount} total packages)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
          onSuccess={handleFormSuccess}
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

          </div>
        )}
      </Modal>
    </div>
  );
}