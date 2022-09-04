const router = require("express").Router();

module.exports = ({ CodeHandler }) => {
    // Routes Here
    router.post("/", CodeHandler.generatePromoCode);

    router.post("/use", CodeHandler.usePromoCode);

    router.get("/:code", CodeHandler.getOnePromoCode);

    return router;
};
