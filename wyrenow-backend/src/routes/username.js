
const express = require('express');
const router = express.Router();
const usernameController  = require('../controllers/usernameController');

/**
 * @route POST /api/validation/user
 * @desc Validate a user through the wyrenow API
 * @access Public
 */
router.post('/', usernameController.getUserDetails);

module.exports = router;