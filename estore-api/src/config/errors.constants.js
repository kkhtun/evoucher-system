const TOKEN_ERRORS = {
    REFRESH_TOKEN_NOT_FOUND: "Invalid refresh token",
    REFRESH_TOKEN_EXPIRED: "Refresh token expired, please login again",
};

const PAYMENT_ERRORS = {
    METHOD_NOT_ALLOWED: "Payment method not allowed",
    INVALID_BRAND: "Invalid Card Brand Submitted",
};

const EVOUCHER_ERRORS = {
    EVOUCHER_NOT_FOUND: "Evoucher Not Found",
    INVALID_STATUS: "Invalid Evoucher Status",
    INVALID_MOBILE: "Cannot use this mobile for this evoucher",
    EVOUCHER_EXPIRED: "Evoucher Expired",
    EVOUCHER_ZERO_BALANCE: "Evoucher has zero balance",
    EVOUCHER_LIMIT_REACHED: "Evoucher has reached purchase limit",
};

module.exports = { TOKEN_ERRORS, PAYMENT_ERRORS, EVOUCHER_ERRORS };
