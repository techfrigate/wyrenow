const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/countryController');
const { validateRequest, countrySchema, regionSchema,validateCountryParams } = require('../middlewares/validation');

// Country routes
router.get('/', CountryController.getAllCountries);
router.get('/registration', CountryController.getCountriesForRegistration);
router.get('/:id', CountryController.getCountryById);
router.post('/', validateRequest(countrySchema), CountryController.createCountry);
router.put('/:id', validateRequest(countrySchema), CountryController.updateCountry);
router.delete('/:id', CountryController.deleteCountry);

// Region routes
router.get('/:id/regions',validateCountryParams, CountryController.getCountryRegions);
router.post('/:id/regions', validateRequest(regionSchema), CountryController.addRegionToCountry);
router.put('/regions/:regionId', validateRequest(regionSchema), CountryController.updateRegion);
router.delete('/regions/:regionId', CountryController.deleteRegion);

module.exports = router;