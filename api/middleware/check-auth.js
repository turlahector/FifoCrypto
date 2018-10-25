const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
    } catch(error) {
        return res.status(401).json({
            status : "error",
            message: 'Auth failed'
        });
    }
    
    next();

};

//use to check session user or user token if valid
exports.validateToken = (req, res, next) => {
    try {
        const token = req.body.token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;

        return res.status(200).json({
            status :"success",
            message : "Valid Token",
            result : decoded
        });
        
    } catch(error) {
        return res.status(401).json({
            status : "error",
            message: 'Auth failed'
        });
    }
}    