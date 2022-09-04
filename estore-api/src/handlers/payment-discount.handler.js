const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

module.exports = ({ PaymentDiscountController, CARD_BRANDS }) => ({
    createPaymentMethod: async (req, res, next) => {
        const { value, error } = Joi.object({
            payment_method: Joi.string()
                .valid(...CARD_BRANDS)
                .required(),
            payment_method_discount: Joi.number().integer().required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response =
                await PaymentDiscountController.createPaymentMethod(value);
            return res.status(201).send(response);
        } catch (e) {
            if (e.message.includes("duplicate key error")) {
                return res.status(409).send({
                    code: 409,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
    getPaymentMethods: async (req, res, next) => {
        const { value, error } = Joi.object({
            limit: Joi.number().integer().default(0),
            skip: Joi.number().integer().default(0),
        }).validate(req.query);

        if (error) return next(error);

        try {
            const response = await PaymentDiscountController.getPaymentMethods(
                req.query
            );
            return res.status(200).send(response);
        } catch (e) {
            return next(e);
        }
    },
    calculatePaymentDiscount: async (req, res, next) => {
        const { value, error } = Joi.object({
            payment_method: Joi.string()
                .valid(...CARD_BRANDS)
                .required(),
            amount: Joi.number().required(),
            quantity: Joi.number().default(1).optional(),
        }).validate(req.query);

        if (error) return next(error);

        try {
            const response =
                await PaymentDiscountController.calculatePaymentDiscount(value);
            return res.status(200).send(response);
        } catch (e) {
            return next(e);
        }
    },
});
