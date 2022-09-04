const mongoose = require("mongoose");
const {
    EVOUCHER_STATUSES,
    EVOUCHER_TYPES,
} = require("../config/evoucher.constants");
const { CARD_BRANDS } = require("../config/cards.constants");

const EvoucherSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        image: {
            type: String,
        },
        // payment stuff
        // initial defined amount per promo code that can be used e.g 25$, 50$ gift cards?
        amount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        payment_method: {
            type: String,
            enum: CARD_BRANDS,
        },
        payment_method_discount: {
            type: Number,
        },
        // total amount paid by user
        // e.g he generate two 50$ evouchers with visa -> 10% off for each voucher
        // each $45 cost, therefore subtotal is $90
        subtotal: {
            type: Number,
        },
        // will be generated
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        status: {
            type: String,
            required: true,
            default: EVOUCHER_STATUSES.PENDING,
            enum: Object.values(EVOUCHER_STATUSES),
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(EVOUCHER_TYPES),
        },
        evoucher_username: {
            type: String,
        },
        evoucher_mobile: {
            type: String,
            required: true,
        },
        purchase_limit: {
            type: Number,
            required: true,
            default: 3,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("EvoucherModel", EvoucherSchema, "evouchers");
