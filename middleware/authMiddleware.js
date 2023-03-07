const jwt = require ("jsonwebtoken");
const {secretAccessKey} = require ("../config");

module.exports = function (request, response, next) {
    if (request.method === "OPTIONS"){
        next()
    }
    try {
        const token = request.headers.authorization.split(" ")[1];
        if (!token){
            return response.status(403).json({message: "User not authorized"});
        }

        const decodedData = jwt.verify(token, secretAccessKey);
        response.user = decodedData;
        next();
    }catch (err){
        console.log(err);
        return response.status(403).json({message: "User not authorized"});
    }
}