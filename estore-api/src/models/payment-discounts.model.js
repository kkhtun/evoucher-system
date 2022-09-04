const mongoose = require("mongoose");
const { CARD_BRANDS } = require("../config/cards.constants");

const PaymentDiscountSchema = new mongoose.Schema({
    payment_method: {
        type: String,
        required: true,
        unique: true,
        enum: CARD_BRANDS,
    },
    payment_method_discount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model(
    "PaymentDiscount",
    PaymentDiscountSchema,
    "payment_discounts"
);
