const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { findMLMUserByEmail } = require('../repository/MLMRegistration');
const {HttpError} = require('../utils/helpers');


const login = async (email, password) => {
    if(!email || !password) throw new HttpError('Email and password are required', 400);
    console.log(email, password);
  const user = await findMLMUserByEmail(email);
  if (!user) throw new HttpError('User not found', 404);
 
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new HttpError('Invalid password', 401);

  const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });

  return { token, user: user };
};

module.exports = {
    login
};
