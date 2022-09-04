const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

module.exports = ({ CodeController, PROMO_CODE_ERRORS }) => ({
    generatePromoCode: async (req, res, next) => {
        const { value, error } = Joi.object({
            quantity: Joi.number().integer().min(1).required(),
            evoucher: Joi.objectid().required(),
            evoucher_username: Joi.string().required(),
            evoucher_mobile: Joi.string().required(),
            balance: Joi.number().required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response = await CodeController.generatePromoCode(value);
            return res.status(201).send(response);
        } catch (e) {
            return next(e);
        }
    },
    getOnePromoCode: async (req, res, next) => {
        const { value, error } = Joi.object({
            code: Joi.string().length(11),
        }).validate(req.params);

        if (error) return next(error);
        try {
            const response = await CodeController.getOnePromoCode(value.code);
            return res.status(200).send(response);
        } catch (e) {
            if (PROMO_CODE_ERRORS.PROMO_CODE_NOT_FOUND === e.message) {
                return res.status(404).send({
                    code: 404,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
    usePromoCode: async (req, res, next) => {
        const { value, error } = Joi.object({
            code: Joi.string().length(11),
            used_amount: Joi.number().required().min(0),
        }).validate(req.body);

        if (error) return next(error);
        try {
            const response = await CodeController.usePromoCode(value);
            return res.status(200).send(response);
        } catch (e) {
            if (PROMO_CODE_ERRORS.PROMO_CODE_NOT_FOUND === e.message) {
                return res.status(404).send({
                    code: 404,
                    message: e.message,
                });
            }
            if (
                PROMO_CODE_ERRORS.PROMO_CODE_INSUFFICIENT_BALANCE === e.message
            ) {
                return res.status(404).send({
                    code: 404,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
});
