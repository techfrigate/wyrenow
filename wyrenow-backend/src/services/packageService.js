const PackageRepository = require('../repository/Package');

const getAllPackages = async (filters) => {
  const packages = await PackageRepository.findAll(filters);
  const totalCount = await PackageRepository.count(filters);
  return {
    packages,
    totalCount,
    currentPage: filters.page || 1,
    totalPages: Math.ceil(totalCount / (filters.limit || 10))
  };
};

const getPackageById = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    throw new Error('Package not found');
  }
  return package;
};

const createPackage = async (packageData) => {
  // Check if package name already exists
  const existingPackage = await PackageRepository.findByName(packageData.name);
  if (existingPackage) {
    throw new Error('Package with this name already exists');
  }
  return await PackageRepository.create(packageData);
};

const updatePackage = async (id, packageData) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    throw new Error('Package not found');
  }

  // Check if updating name and it conflicts with existing
  if (packageData.name && packageData.name !== package.name) {
    const existingPackage = await PackageRepository.findByName(packageData.name);
    if (existingPackage) {
      throw new Error('Package with this name already exists');
    }
  }

  return await PackageRepository.update(id, packageData);
};

const deletePackage = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    throw new Error('Package not found');
  }
  return await PackageRepository.delete(id);
};

const togglePackageStatus = async (id) => {
  const package = await PackageRepository.findById(id);
  if (!package) {
    throw new Error('Package not found');
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