 const {
    findAllCountries,
    findCountryById,
    findCountryByCode,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountryRegions,
    addRegionToCountry,
    updateRegion,
    deleteRegion,
    countCountries
} = require('../repository/Country');
const { errorResponse } = require('../utils/helpers');

// Get all countries with pagination and filters
async function getAllCountries(filters) {
    try {
        const countries = await findAllCountries(filters);
        const totalCount = await countCountries(filters);
        
        return {
            countries,
            totalCount,
            currentPage: filters.page || 1,
            totalPages: Math.ceil(totalCount / (filters.limit || 10))
        };
    } catch (error) {
        errorResponse(
            'Failed to fetch countries',
            { success: false, message: error.message },
            500
        )
         
    }
}

// Get country by ID
async function getCountryById(id) {
    const country = await findCountryById(id);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    return country;
}

// Create new country
async function createCountryService(countryData) {
    // Check if country code already exists
    const existingCountry = await findCountryByCode(countryData.code);
    if (existingCountry) {
        throw new AppError('Country with this code already exists', 409);
    }
    
    return await createCountry(countryData);
}

// Update country
async function updateCountryService(id, countryData) {
    const country = await findCountryById(id);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    
    // Check if updating code and it conflicts with existing
    if (countryData.code && countryData.code !== country.code) {
        const existingCountry = await findCountryByCode(countryData.code);
        if (existingCountry) {
            throw new AppError('Country with this code already exists', 409);
        }
    }
    
    return await updateCountry(id, countryData);
}

// Delete country
async function deleteCountryService(id) {
    const country = await findCountryById(id);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    
    return await deleteCountry(id);
}

// Get regions for a country
async function getCountryRegionsService(countryId, filters) {
    const country = await findCountryById(countryId);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    
    return await getCountryRegions(countryId, filters);
}

// Add region to country
async function addRegionToCountryService(countryId, regionData) {
    const country = await findCountryById(countryId);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    
    return await addRegionToCountry(countryId, regionData);
}

// Update region
async function updateRegionService(regionId, regionData) {
    return await updateRegion(regionId, regionData);
}

// Delete region
async function deleteRegionService(regionId) {
    return await deleteRegion(regionId);
}

// Get countries for registration (active only)
async function getCountriesForRegistration() {
    return await findAllCountries({ status: 'active' });
}

// Export all functions
module.exports = {
    getAllCountries,
    getCountryById,
    createCountryService,
    updateCountryService,
    deleteCountryService,
    getCountryRegionsService,
    addRegionToCountryService,
    updateRegionService,
    deleteRegionService,
    getCountriesForRegistration
};