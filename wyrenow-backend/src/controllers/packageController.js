const PackageService = require('../services/packageService');
const { successResponse } = require('../utils/helpers');

// Get all packages
const getAllPackages = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            search, 
            sortBy = 'created_at', 
            sortOrder = 'DESC',
            minPv,
            maxPv
        } = req.query;
        
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            status,
            search,
            sortBy,
            sortOrder,
            minPv: minPv ? parseInt(minPv) : undefined,
            maxPv: maxPv ? parseInt(maxPv) : undefined
        };

        const result = await PackageService.getAllPackages(filters);

        successResponse(res, {
            message: 'Packages retrieved successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get package by ID
const getPackageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const package = await PackageService.getPackageById(id);

        successResponse(res, {
            message: 'Package retrieved successfully',
            data: package
        });
    } catch (error) {
        next(error);
    }
};

// Create new package
const createPackage = async (req, res, next) => {
    try {
        const package = await PackageService.createPackage(req.body);

        successResponse(res, {
            message: 'Package created successfully',
            data: package
        }, 201);
    } catch (error) {
        next(error);
    }
};

// Update package
const updatePackage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const package = await PackageService.updatePackage(id, req.body);

        successResponse(res, {
            message: 'Package updated successfully',
            data: package
        });
    } catch (error) {
        next(error);
    }
};

// Delete package
const deletePackage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await PackageService.deletePackage(id);

        successResponse(res, {
            message: 'Package deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Toggle package status
const togglePackageStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const package = await PackageService.togglePackageStatus(id);

        successResponse(res, {
            message: 'Package status updated successfully',
            data: package
        });
    } catch (error) {
        next(error);
    }
};

// Get active packages (for registration)
const getActivePackages = async (req, res, next) => {
    try {
        const packages = await PackageService.getActivePackages();

        successResponse(res, {
            message: 'Active packages retrieved successfully',
            data: packages
        });
    } catch (error) {
        next(error);
    }
};

// Bulk update package status
const bulkUpdateStatus = async (req, res, next) => {
    try {
        const { ids, status } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Package IDs are required'
            });
        }

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const packages = await PackageService.bulkUpdatePackageStatus(ids, status);

        successResponse(res, {
            message: `${packages.length} packages updated successfully`,
            data: packages
        });
    } catch (error) {
        next(error);
    }
};

// Calculate package prices based on PV
const calculatePrices = async (req, res, next) => {
    try {
        const { pv, pvRates } = req.body;
        
        if (!pv || !pvRates) {
            return res.status(400).json({
                success: false,
                message: 'PV and PV rates are required'
            });
        }

        const prices = await PackageService.calculatePackagePrices(pv, pvRates);

        successResponse(res, {
            message: 'Prices calculated successfully',
            data: prices
        });
    } catch (error) {
        next(error);
    }
};


const getPackagesByCountry = async (req, res, next) => {
  try {
    const { countryId } = req.params;
    const data = await PackageService.getPackagesByCountry(countryId);
     
    return successResponse(res, {
      message: 'Packages fetched successfully',
      packages: data
    });
  } catch (error) {
     next(error);
  }
};


module.exports = {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    togglePackageStatus,
    getActivePackages,
    bulkUpdateStatus,
    calculatePrices,
    getPackagesByCountry
};