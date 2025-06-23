const express = require('express');
const countryRoutes = require('./countries');
const registrationRoutes = require('./registration');
const usernameRoutes = require('./username');
const router = express.Router();

router.use('/countries', countryRoutes);
router.use('/registration', registrationRoutes);
router.use('/package', registrationRoutes);
router.use('/username', usernameRoutes);

module.exports = router;