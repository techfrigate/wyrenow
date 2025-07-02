const registrationService = require('../services/registrationService');
const { successResponse, errorResponse, HttpError } = require('../utils/helpers');
 

const checkUsernameExists = async (req, res, next) => {
    try {
        const { username } = req.params;
        const exists = await registrationService.checkUsernameExists(username);
        
        if (!exists) {
           throw new HttpError('Username does not exist', 404);
        }

        successResponse(res, {
            message: 'Username exists',
            data: exists,
        });
    } catch (error) {
        next(error);
    }
};


const checkSponsorPositionsById = async (req, res,next) => {
  try {
    const { sponsorId } = req.params;
    
    if (!sponsorId) {
      throw new HttpError('Sponsor ID is required', 400);
    }
    
    const sponsorData = await registrationService.checkSponsorPositions(parseInt(sponsorId));
    
    if (!sponsorData) {
      throw new HttpError('Sponsor not found', 404);
    }
    
    return successResponse(res, {
      data: {...sponsorData, full_name: `${sponsorData.first_name} ${sponsorData.last_name}` }
    });
  } catch (error) {
     next(error)
  }
};

  
 
const findAvailablePositions = async (req, res,next) => {
  try {
     const {userId,leg} = req.params;
    
    const users = await registrationService.findEmptySpaces(userId,leg);
    
    return successResponse(res, {
      data: users
    });
  } catch (error) {
    next(error)
  }
};

 
const placeUser = async (req, res,next) => {
  try {
 
    const { username, placementLeg ,sponsor_username,first_name,last_name,email,phone,password,transaction_pin,country_id,region_id,package_id,placement_user_id} = req.body;
 
     if (!username || !placementLeg || !sponsor_username || !first_name || !last_name || !email || !phone || !password || !transaction_pin || !country_id || !region_id || !package_id || !placement_user_id) {
       throw new HttpError('All fields are required', 400);
    }

    if (placementLeg !== 'left' && placementLeg !== 'right') {
      throw new HttpError('Invalid placement leg', 400);
    }

    const registerUser =  await registrationService.createMLMRegistration(req.body);
    return successResponse(res, {
      message: 'User placed successfully in binary tree',
      data:registerUser
    });

  } catch (error) {
     next(error);
  }
};

 
const getUserbyusernameEmailPhone = async (req, res) => {
  try {
     const { username, email, phone } = req.body;
  if(!username || !email || !phone){
   throw new HttpError('Username, email and phone are required', 400);
  }
  const data =  await registrationService.getUserbyusernameEmailPhone(username, email, phone);
 
  return successResponse(res, {
    data: data
  });

  } catch (error) {
 
    next(error);
  }
}
 

module.exports = {
  checkUsernameExists,
  checkSponsorPositionsById,
  findAvailablePositions,
  placeUser,
  getUserbyusernameEmailPhone
};
