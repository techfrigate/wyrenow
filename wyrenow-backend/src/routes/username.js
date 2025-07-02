
const express = require('express');
const router = express.Router();
const usernameController  = require('../controllers/usernameController');

 
router.post('/', usernameController.getUserDetails);//running

module.exports = router;