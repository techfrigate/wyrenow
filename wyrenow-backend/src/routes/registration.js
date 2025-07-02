const express = require('express');
const registrationController = require('../controllers/registrationController');
const { validateRequest, registrationSchema} = require('../middlewares/validation');
const auttController = require('../controllers/authController');
const router = express.Router();

router.get('/check-username/:username', registrationController.checkUsernameExists);//running
// Check if a sponsor has available positions by ID
router.get('/sponsor/id/:sponsorId', registrationController.checkSponsorPositionsById); // running
// Find all users with available positions
router.get('/available/:userId/:leg', registrationController.findAvailablePositions); // running
// Place a user in the binary tree
router.post('/place', registrationController.placeUser); // running
 
router.post('/login', auttController.login); //running    

router.post('/validate-user', registrationController.getUserbyusernameEmailPhone);//running

module.exports = router;