const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = ({ PaymentDiscountModel, PAYMENT_ERRORS }) => ({
    createPaymentMethod: async ({
        payment_method,
        payment_method_discount,
    }) => {
        const paymentMethod = new PaymentDiscountModel({
            payment_method: payment_method.toLowerCase(),
            payment_method_discount,
        });
        return await paymentMethod.save();
    },

    // different card brands have different discount prices
    calculatePaymentDiscount: async ({ payment_method, amount, quantity }) => {
        const paymentDiscount = await PaymentDiscountModel.findOne({
            payment_method,
        })
            .lean()
            .exec();

        if (!paymentDiscount)
            throw new Error(PAYMENT_ERRORS.METHOD_NOT_ALLOWED);

        amount = parseFloat(amount);
        const discount_amount = paymentDiscount.payment_method_discount
            ? amount - (paymentDiscount.payment_method_discount / 100) * amount
            : amount;

        return {
            discount_amount_per_code: discount_amount,
            payment_method_discount: paymentDiscount.payment_method_discount,
            total_amount_to_pay: discount_amount * parseInt(quantity),
        };
    },

    getPaymentMethods: async ({ limit, skip }) => {
        let query = {};
        const [data, count] = await Promise.all([
            PaymentDiscountModel.find(query)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            PaymentDiscountModel.find(query).countDocuments(),
        ]);
        return { data, count };
    },

    getOnePaymentMethod: async (filter) => {
        const paymentMethod = await PaymentDiscountModel.findOne(filter)
            .lean()
            .exec();

        if (!paymentMethod) throw new Error(PAYMENT_ERRORS.METHOD_NOT_ALLOWED);
        return paymentMethod;
    },

    validateCard: async (card) => {
        const token = await stripe.tokens.create({
            card: card,
        });

        return token;
    },
});
