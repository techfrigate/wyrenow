const PackageRepository = require('../repository/PackageRepository');
const { errorResponse } = require('../utils/helpers');

const getAllPackages = async (filters) => {
  try {
    const packages = await PackageRepository.findAll(filters);
    const totalCount = await PackageRepository.count(filters);
    return {
      packages,
      totalCount,
      currentPage: filters.page || 1,
      totalPages: Math.ceil(totalCount / (filters.limit || 10))
    };
  } catch (error) {
    errorResponse(
      'Failed to fetch packages',
      { success: false, message: error.message },
      500
    );
    
  }
};

const getPackageById = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    return errorResponse(
      'Package not found',
      { success: false, message: 'Package not found' },
      404
    );
  }
  return package;
};

const createPackage = async (packageData) => {
  // Check if package name already exists
  const existingPackage = await PackageRepository.findByName(packageData.name);
  if (existingPackage) {
   return errorResponse(
      'Package with this name already exists',
      { success: false, message: 'Package with this name already exists' },
      409
    );
  }
  return await PackageRepository.create(packageData);
};

const updatePackage = async (id, packageData) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
   return errorResponse(
      'Package not found',
      { success: false, message: 'Package not found' },
      404
    );
  }

  // Check if updating name and it conflicts with existing
  if (packageData.name && packageData.name !== package.name) {
    const existingPackage = await PackageRepository.findByName(packageData.name);
    if (existingPackage) {
       return errorResponse(
            'Package with this name already exists',
            { success: false, message: 'Package with this name already exists' },
            409
        );
    }
  }

  return await PackageRepository.update(id, packageData);
};

const deletePackage = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
   return  errorResponse(
      'Package not found',
      { success: false, message: 'Package not found' },
      404
    );
  }
  return await PackageRepository.delete(id);
};

const togglePackageStatus = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    return errorResponse(
      'Package not found',
      { success: false, message: 'Package not found' },
      404
    );
  }

  const newStatus = package.status === 'active' ? 'inactive' : 'active';
  return await PackageRepository.updateStatus(id, newStatus);
};

const getActivePackages = async () => {
  return await PackageRepository.getActivePackages();
};

const bulkUpdatePackageStatus = async (ids, status) => {
  return await PackageRepository.bulkUpdateStatus(ids, status);
};

const calculatePackagePrices = async (pv, pvRates) => {
  return {
    price_ngn: pv * (pvRates.NGN || 525),
    price_ghs: pv * (pvRates.GHS || 12)
  };
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  getActivePackages,
  bulkUpdatePackageStatus,
  calculatePackagePrices
};