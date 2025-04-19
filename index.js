// use dotenv for environment variables
const dotenv = require("dotenv");
dotenv.config();

// create express app
const express = require("express");
const app = express();

// use morgan for logging
const morgan = require("morgan");
app.use(morgan("tiny"));

// use cors for cross-origin resource sharing
const cors = require("cors");
app.use(cors());

// process json paylaod
app.use(express.json());

// import routes
const authRoute = require("./routes/auth.js");

// use routes
app.use("/api/auth", authRoute);

// apply global error handler
const errorHandler = require("./middlewares/globalErrorHandler.js");
app.use(errorHandler);

// connect to mongo db and start the server
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
