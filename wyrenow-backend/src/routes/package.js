const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packageController');
const { validateRequest, packageSchema } = require('../middlewares/validation');

// Package routes
router.get('/getpackages', PackageController.getAllPackages);
router.get('/packages/active', PackageController.getActivePackages);
router.get('/packages/:id', PackageController.getPackageById);
router.post('/packages', validateRequest(packageSchema), PackageController.createPackage);
router.put('/packages/:id', validateRequest(packageSchema), PackageController.updatePackage);
router.delete('/packages/:id', PackageController.deletePackage);
router.patch('/packages/:id/status', PackageController.togglePackageStatus);
router.post('/packages/bulk-status', PackageController.bulkUpdateStatus);
router.post('/packages/calculate-prices', PackageController.calculatePrices);

module.exports = router;