require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const loaders = require("./loaders/index");
const { redisClient } = require("./loaders/redis.loader");
const {
    checkSharedServerSecretKey,
} = require("./middlewares/request-validator.middleware");
const { routes, databaseConnection } = loaders.bootstrapLoaders();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for testing
app.get("/", (req, res) => {
    return res.status(200).send("Hello World");
});

// entry to resource routes
app.use("/api/v1", checkSharedServerSecretKey, routes);

// error handler
app.use((err, req, res, next) => {
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
    const port = process.env.PORT || 5000;

    await databaseConnection;
    await redisClient.connect();
    app.listen(port, function () {
        console.log(`Server listening on http://localhost:${port}`);
    });
})();

module.exports = app;
