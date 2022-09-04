require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const { JsonWebTokenError } = require("jsonwebtoken");
const { ValidationError } = require("joi");

const loaders = require("./loaders/index");
const { redisClient } = require("./loaders/redis.loader");
const { routes, databaseConnection } = loaders.bootstrapLoaders();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./middlewares/passport-stretegy.middleware");

// for testing (with or without auth)
app.get("/", (req, res) => {
    return res.status(200).send("Hello World");
});

app.get(
    "/auth",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        return res
            .status(200)
            .send({ message: "Hello World Authenticated", user: req.user });
    }
);

// entry to resource routes
app.use("/api/v1", routes);

// error handler
app.use((err, req, res, next) => {
    // handle JOI validation errors here
    if (err instanceof ValidationError) {
        return res.status(400).json({
            code: 400,
            message: err.message,
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(400).json({
            code: 400,
            message: err.message,
        });
    }
    console.group("[ServerError]: ", err.message);
    console.error("[STACK]: ", err.stack);
    return res.status(500).json({
        code: 500,
        message: err.message,
    });
});

// unmatched route
app.use((req, res, next) => {
    return res.status(404).json({
        code: 404,
        message: "Route Not Found",
    });
});

// spin up server here
(async function main() {
    const port = process.env.PORT || 3000;

    await databaseConnection;
    await redisClient.connect();
    app.listen(port, function () {
        console.log(`Server listening on http://localhost:${port}`);
    });
})();

module.exports = app;
