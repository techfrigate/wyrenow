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
    countCountries,
    createRegion
} = require('../repository/Country');
const { errorResponse } = require('../utils/helpers');
// countryService.js
const { pool } = require('../config/database');

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

async function createCountryService(countryData) {
    const connection = await pool.getConnection();
    
    try {
        console.log('Service creating country with regions:', countryData);
        
        await connection.beginTransaction();
        
        const existingCountry = await findCountryByCode(countryData.code);
        if (existingCountry) {
            throw new AppError('Country with this code already exists', 409);
        }
        
        // Ensure the new schema fields have default values if not provided
        const countryDataWithDefaults = {
            ...countryData,
            product_pv_rate: countryData.product_pv_rate || 1200.00,
            bonus_pv_rate: countryData.bonus_pv_rate || 525.00,
            platform_margin: countryData.platform_margin || 2000.00,
            cross_country_cap_percentage: countryData.cross_country_cap_percentage || 30.00
        };
        
        const countryResult = await createCountry(countryDataWithDefaults, connection);
        console.log('Country created with ID:', countryResult.id);
        
        if (countryData.regions && countryData.regions.length > 0) {
            console.log(`Creating ${countryData.regions.length} regions for country ${countryResult.id}`);
            
            for (const regionData of countryData.regions) {
                await createRegion(countryResult.id, regionData, connection);
                console.log(`Created region: ${regionData.name}`);
            }
        }
        
        await connection.commit();
        
        const completeCountry = await findCountryById(countryResult.id);
        console.log('Country created successfully with regions:', completeCountry);
        
        return completeCountry;
    } catch (error) {
        await connection.rollback();
        console.error('Service error:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Update country
async function updateCountryService(id, countryData) {
    const country = await findCountryById(id);
    if (!country) {
        throw new AppError('Country not found', 404);
    }
    
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
    console.log('Fetching regions for country ID:', countryId);
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