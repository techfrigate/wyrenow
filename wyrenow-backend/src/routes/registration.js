const express = require('express');
const registrationController = require('../controllers/registrationController');
const { validateRequest, registrationSchema} = require('../middlewares/validation');

const router = express.Router();

router.post('/register-user', validateRequest(registrationSchema), registrationController.registerUser);

module.exports = router;