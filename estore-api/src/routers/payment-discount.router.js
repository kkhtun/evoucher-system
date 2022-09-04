const { Router } = require("express");
module.exports = ({ PaymentDiscountHandler }) => {
    // Routes Here
    const router = Router();

    router.post("/", PaymentDiscountHandler.createPaymentMethod);
    router.get("/", PaymentDiscountHandler.getPaymentMethods);
    router.get(
        "/calculate-discount",
        PaymentDiscountHandler.calculatePaymentDiscount
    );

    return router;
};
