const jwt = require('jsonwebtoken');
function decodingToken (token) {
    return jwt.verify(token,process.env.JWT_SECRET)    
}

module.exports = decodingToken