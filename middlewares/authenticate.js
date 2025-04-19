const ErrorResponse = require("../utils/errorResponse.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    // Get token from header
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }
};

module.exports = authenticate;
