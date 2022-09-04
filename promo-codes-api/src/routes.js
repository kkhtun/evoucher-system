const router = require("express").Router();

module.exports = (container) => {
    // Routes Here
    router.use("/promo_codes", container.cradle.CodesRouter);

    return router;
};
