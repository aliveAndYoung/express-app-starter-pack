const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const generateResponse = require("../utils/generateResponse.js");

// usage : Register a new user
// route : POST /api/auth/register
// access : Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
    });

    sendTokenResponse(user, 201, res);
});

// usage : Login user
// route : POST /api/auth/login
// access : Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email & password are provided
    if (!email || !password) {
        return next(
            new ErrorResponse("Please provide an email and password", 400)
        );
    }

    // Check for user
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches the hashed one
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
});

// usage : Get current logged in user
// route : POST /api/auth/me
// access : Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json(generateResponse(true, 200, user));
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: "1d",
        httpOnly: true,
    };

    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).json(generateResponse(true, 200, { token }));
};

module.exports = {
    register,
    login,
    getMe,
};
