const { Router } = require("express");

module.exports = ({ UserHandler }) => {
    // Routes Here
    const router = Router();

    router.post("/login", UserHandler.loginUser);
    router.post("/register", UserHandler.registerUser);
    router.post("/refresh-token", UserHandler.refreshToken);

    return router;
};
