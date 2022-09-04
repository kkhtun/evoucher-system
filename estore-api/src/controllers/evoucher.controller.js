module.exports = ({
    EvoucherService,
    PaymentDiscountService,
    CodeService,
    EVOUCHER_STATUSES,
}) => ({
    createEvoucher: async (data) => {
        return await EvoucherService.createEvoucher(data);
    },
    updateEvoucher: async (data) => {
        const evoucher = await EvoucherService.getOneEvoucher({
            _id: data._id,
        });
        return await EvoucherService.updateEvoucher(data);
    },
    checkoutEvoucher: async (data) => {
        const { card, _id } = data;
        const evoucher = await EvoucherService.getOneEvoucher({ _id });
        if (evoucher.status !== EVOUCHER_STATUSES.PENDING) {
            return { message: "Already checked out!", code: 419 };
        }
        const token = await PaymentDiscountService.validateCard(card);
        const payment_method = token.card.brand.toLowerCase();

        const { payment_method_discount, total_amount_to_pay } =
            await PaymentDiscountService.calculatePaymentDiscount({
                payment_method,
                amount: evoucher.amount,
                quantity: evoucher.quantity,
            });

        const updatedEvoucher = await EvoucherService.updateEvoucher({
            _id,
            payment_method,
            payment_method_discount,
            subtotal: total_amount_to_pay,
            status: EVOUCHER_STATUSES.ACTIVE,
        });

        // pay total_amount_to_pay with card here, call stripe API etc.

        // generate promo codes here API call to promo code microservice
        const codes = await CodeService.generatePromoCodes({
            quantity: evoucher.quantity,
            evoucher: evoucher._id,
            evoucher_username: evoucher.evoucher_username,
            evoucher_mobile: evoucher.evoucher_mobile,
            balance: evoucher.amount,
        });

        return { evoucher: updatedEvoucher, codes };
    },
    getEvouchers: async (query) => {
        return await EvoucherService.getEvouchers(query);
    },
    getOneEvoucher: async (_id) => {
        const evoucher = await EvoucherService.getOneEvoucher({ _id });
        const codes = await CodeService.getPromoCodesByEvoucherId(evoucher._id);
        return { ...evoucher, codes };
    },
    checkPromoCodeIsValid: async ({ code, mobile }) => {
        const promoCode = await CodeService.getPromoCode(code);
        const evoucher = await EvoucherService.validateEvoucherWithCode({
            ...promoCode,
            caller_mobile: mobile,
        });

        return { evoucher, code: promoCode };
    },
    useEvoucherPromoCode: async ({ code, mobile, used_amount }) => {
        const promoCode = await CodeService.getPromoCode(code);
        const evoucher = await EvoucherService.validateEvoucherWithCode({
            ...promoCode,
            caller_mobile: mobile,
        });

        const usedCode = await CodeService.usePromoCode({ code, used_amount });

        return { evoucher, code: usedCode };
    },
});
