const axios = require('axios');
const config = require('../config/environment');
/**
 * Get user details from wyrenow API
 * @param {string} username - Username to validate
 * @returns {Promise<Object>} - API response
 */
const getUserDetails = async (username) => {
    console.log(username)
  try {
   const formData = new URLSearchParams();
    formData.append('getuserDetails', '1');
    formData.append('uname', username);

    const response = await axios.post(
    config.WYRENOW_URL,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error calling wyrenow validation API:', error.message);
    throw error;
  }
};

module.exports = {
  getUserDetails
};