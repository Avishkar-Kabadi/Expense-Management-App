const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ userid: user.id, email: user.email }, process.env.JWT_SECRET);
}


module.exports = generateToken;