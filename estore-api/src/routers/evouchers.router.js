const { Router } = require("express");
const s3Upload = require("../middlewares/upload.middleware")();
module.exports = ({ EvoucherHandler }) => {
    // Routes Here
    const router = Router();

    router.post("/", s3Upload.single("image"), EvoucherHandler.createEvoucher);

    router.get("/validate", EvoucherHandler.checkPromoCodeIsValid);

    router.get("/:_id", EvoucherHandler.getOneEvoucher);

    router.post("/checkout", EvoucherHandler.checkoutEvoucher);

    router.get("/", EvoucherHandler.getEvouchers);

    router.patch(
        "/:_id",
        s3Upload.single("image"),
        EvoucherHandler.updateEvoucher
    );

    return router;
};
