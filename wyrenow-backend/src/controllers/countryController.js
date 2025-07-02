 const countryService = require('../services/countryService');
 
const { successResponse } = require('../utils/helpers');

// Get all countries
const getAllCountries = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, search, sortBy, sortOrder } = req.query;
        
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            status,
            search,
            sortBy,
            sortOrder
        };

        const result = await countryService.getAllCountries(filters);

        successResponse(res, {
            message: 'Countries retrieved successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get country by ID
const getCountryById  = async (req, res, next) => {
    try {
        const { id } = req.params;
        const country = await countryService.getCountryById(id);

        successResponse(res, {
            message: 'Country retrieved successfully',
            data: country
        });
    } catch (error) {
        next(error);
    }
};

const createCountry = async (req, res, next) => {
    try {
        console.log('Creating country with data:', req.body);
        
        const country = await countryService.createCountryService(req.body);

        successResponse(res, {
            message: 'Country created successfully',
            data: country
        }, 201);
    } catch (error) {
        console.error('Error creating country:', error);
        next(error);
    }
};

// Update country
const updateCountry  = async (req, res, next) => {
    try {
        const { id } = req.params;
        const country = await countryService.updateCountryService(id, req.body);

        successResponse(res, {
            message: 'Country updated successfully',
            data: country
        });
    } catch (error) {
        next(error);
    }
};

// Delete country
const deleteCountry  = async (req, res, next) => {
    try {
        const { id } = req.params;
        await countryService.deleteCountryService(id);

        successResponse(res, {
            message: 'Country deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get country regions
const getCountryRegions  = async (req, res, next) => {
    try {
        const { countryId  } = req.params;
        const { status } = req.query;
        
        const regions = await countryService.getCountryRegionsService(countryId, { status });

        successResponse(res, {
            message: 'Regions retrieved successfully',
            data: regions
        });
    } catch (error) {
    
        next(error);
    }
};

// Add region to country
const addRegionToCountry  = async (req, res, next) => {
    try {
        const { id } = req.params;
        const region = await countryService.addRegionToCountryService(id, req.body);

        successResponse(res, {
            message: 'Region added successfully',
            data: region
        }, 201);
    } catch (error) {
        next(error);
    }
};

// Update region
const updateRegion  = async (req, res, next) => {
    try {
        const { regionId } = req.params;
        const region = await countryService.updateRegionService(regionId, req.body);

        successResponse(res, {
            message: 'Region updated successfully',
            data: region
        });
    } catch (error) {
        next(error);
    }
};

// Delete region
const deleteRegion  = async (req, res, next) => {
    try {
        const { regionId } = req.params;
        await countryService.deleteRegionService(regionId);

        successResponse(res, {
            message: 'Region deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get countries for registration (active only)
const getCountriesForRegistration  = async (req, res, next) => {
    try {
        const countries = await countryService.getCountriesForRegistration();

        successResponse(res, {
            message: 'Active countries retrieved successfully',
            data: countries
        });
    } catch (error) {
        next(error);
    }
};

// Export all functions
module.exports = {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountryRegions,
    addRegionToCountry,
    updateRegion,
    deleteRegion,
    getCountriesForRegistration
};