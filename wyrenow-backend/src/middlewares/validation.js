const { errorResponse } = require('../utils/helpers');
const Joi = require('joi');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return errorResponse(res, {
                message: 'Validation failed',
                errors: errors
            }, 400);
        }
        
        next();
    };
};

const validateCountryParams = (req, res, next) => {
    const { countryId } = req.params;
    
    if (!countryId || isNaN(countryId)) {
        return errorResponse(res, {
            message: 'Valid country ID is required'
        }, 400);
    }
    
    next();
};

// Validation schemas
// const countrySchema = Joi.object({
//     name: Joi.string().min(2).max(100).required(),
//     code: Joi.string().length(2).uppercase().required(),
//     currency: Joi.string().min(3).max(50).required(),
//     currency_symbol: Joi.string().min(1).max(10).required(),
//     pv_rate: Joi.number().positive().precision(2).required(),
//     status: Joi.string().valid('active', 'inactive').default('active')

// });

// validation.js  (excerpt)
const regionSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    code: Joi.string().min(2).max(10).required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
    geonameId: Joi.number().optional()  
});

// const countrySchema = Joi.object({
//   name: Joi.string().min(2).max(100).required(),
//   code: Joi.string().length(2).uppercase().required(),
//   currency: Joi.string().min(3).max(50).required(),
//   currency_symbol: Joi.string().min(1).max(10).required(),
//   pv_rate: Joi.number().positive().precision(2).required(),
//   status: Joi.string().valid('active', 'inactive').default('active'),

//   // 👇 add this **inside** the same object, after a comma
//   regions: Joi.array()
//     .items(regionSchema)      // make sure regionSchema is defined above
//     .optional()
//     .default([])
// });                            // ← only one closing );


// Define regionSchema separately above this schema
// const regionSchema = Joi.object({ ... });

const countrySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  code: Joi.string().length(2).uppercase().required(), // VARCHAR(3)
  currency: Joi.string().min(3).max(50).required(),
  currency_symbol: Joi.string().min(1).max(10).required(),

  // PV rates and margins
  product_pv_rate: Joi.number().positive().precision(2).default(1200.00),
  bonus_pv_rate: Joi.number().positive().precision(2).default(525.00),
  platform_margin: Joi.number().positive().precision(2).default(2000.00),

  // Cross-country cap
  cross_country_cap_percentage: Joi.number().min(0).max(100).precision(2).default(30.00),

  status: Joi.string().valid('active', 'inactive').default('active'),

  // ✅ Keep this part unchanged
  regions: Joi.array()
    .items(regionSchema) // regionSchema should be defined above
    .optional()
    .default([])
});


// const regionSchema = Joi.object({
//     name: Joi.string().min(2).max(100).required(),
//     code: Joi.string().max(10).optional(),
//     status: Joi.string().valid('active', 'inactive').default('active')
// });


const packageSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional().allow('', null),
    pv: Joi.number().integer().positive().required(),
    price_ngn: Joi.number().positive().precision(2).required(),
    price_ghs: Joi.number().positive().precision(2).required(),
    bottles: Joi.number().integer().min(0).default(1),
    package_type: Joi.string().default('standard'),
    status: Joi.string().valid('active', 'inactive').default('active'),
    features: Joi.array().items(Joi.string()).optional().default([])
});

const registrationSchema = Joi.object({
    sponsorUsername: Joi.string().required(),
    placementUsername: Joi.string().required(),
    placementLeg: Joi.string().valid('left', 'right').required(),
    newUsername: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    dateOfBirth: Joi.date().optional(),
    countryId: Joi.number().integer().positive().required(),
    regionId: Joi.number().integer().positive().required(),
    password: Joi.string().min(6).required(),
    transactionPin: Joi.string().length(4).pattern(/^[0-9]+$/).required(),
    withdrawalDetails: Joi.object().optional(),
    registeredBy: Joi.number().integer().positive().required()
});

module.exports = {
    validateRequest,
    countrySchema,
    regionSchema,
    packageSchema,
    registrationSchema,
    validateCountryParams
};
