const jwt = require('jsonwebtoken');
const User = require('../schema/schema');
require("dotenv").config()

const jwt_token = process.env.jwt_token;

const Authenticate = async (req, res, next) =>{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, jwt_token);
        if(verifyToken){
            const decoded = jwt.decode(token);
            console.log(decoded)
            const data = await User.findOne({ email: decoded.email });
            if(data){
                req.email = decoded.email;
                req.username = data.username;
            }
        }

        if(!req.email) {throw new Error ('User not found')}

        next();
    }
    catch(err){
        res.status(401).send('Unauthorised user: No token provided');
        console.log(err);
    }
}

module.exports = Authenticate;