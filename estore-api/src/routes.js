const router = require("express").Router();

const passport = require("passport");
module.exports = (container) => {
    // Routes Here
    router.use("/users", container.cradle.UsersRouter);
    router.use(
        "/evouchers",
        passport.authenticate("jwt", { session: false }),
        container.cradle.EvouchersRouter
    );
    router.use(
        "/payment-discounts",
        passport.authenticate("jwt", { session: false }),
        container.cradle.PaymentDiscountsRouter
    );

    return router;
};
