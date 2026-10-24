const ApiResponse = require("../utils/apiResponse");

const errorHandler = (err , req , res , next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server went wrong";
    
    return res.status(statusCode).json(new ApiResponse(statusCode, message));      
};

module.exports = errorHandler;
