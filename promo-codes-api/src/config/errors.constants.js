const TOKEN_ERRORS = {
    REFRESH_TOKEN_NOT_FOUND: "Invalid refresh token",
    REFRESH_TOKEN_EXPIRED: "Refresh token expired, please login again",
};

const EVOUCHER_ERRORS = {
    EVOUCHER_NOT_FOUND: "Evoucher Not Found",
};

const PROMO_CODE_ERRORS = {
    PROMO_CODE_NOT_FOUND: "Promo Code Does not exist",
    PROMO_CODE_INSUFFICIENT_BALANCE: "Promo Code has insufficient balance",
};

module.exports = { TOKEN_ERRORS, EVOUCHER_ERRORS, PROMO_CODE_ERRORS };
