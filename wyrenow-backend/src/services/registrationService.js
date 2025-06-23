const MLMRegistration = require('../repository/MLMRegistration');
const { hashPassword } = require('../utils/helpers');

const createMLMRegistration = async (data) => {
    const {
        sponsorUsername,
        placementUsername,
        placementLeg,
        newUsername,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        countryId,
        regionId,
        password,
        transactionPin,
        withdrawalDetails,
        registeredBy
    } = data;

    // Hash passwords
    const hashedPassword = await hashPassword(password);
    const hashedTransactionPin = await hashPassword(transactionPin);
    
    // Prepare registration data
    const registrationData = {
        username: newUsername,
        sponsor_username: sponsorUsername,
        placement_username: placementUsername,
        placement_leg: placementLeg.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        email,
        phone,
        date_of_birth: dateOfBirth,
        country_id: countryId,
        region_id: regionId,
        password_hash: hashedPassword,
        transaction_pin_hash: hashedTransactionPin,
        withdrawal_details: withdrawalDetails,
        registered_by: registeredBy
    };

    return await MLMRegistration.create(registrationData);
};

module.exports = {
    createMLMRegistration
};