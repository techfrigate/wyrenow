const express = require('express');
const countryRoutes = require('./countries');
const registrationRoutes = require('./registration');
const usernameRoutes = require('./username');
const packageRoutes  = require('./package');
 
const treeRoutes = require('./tree');
 
const router = express.Router();

router.use('/countries', countryRoutes);
router.use('/registration', registrationRoutes);
router.use('/package', packageRoutes);
router.use('/username', usernameRoutes);
router.use('/tree', treeRoutes);
module.exports = router;