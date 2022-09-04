const mongoose = require("mongoose");

// promo codes will reference evouchers
const PromoCodeSchema = new mongoose.Schema(
    {
        promo_code: {
            type: String,
            required: true,
            unique: true,
        },
        evoucher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EvoucherModel",
        },
        // who will use the voucher
        evoucher_username: {
            type: String,
        },
        evoucher_mobile: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
        },
        purchased_times: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PromoCodeModel",
    PromoCodeSchema,
    "promo_codes"
);
