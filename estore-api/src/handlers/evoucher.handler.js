const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);
const R = require("ramda");
const adaptor = require("../adaptors/qr.adaptor");

module.exports = ({
    EvoucherController,
    EVOUCHER_TYPES,
    EVOUCHER_ERRORS,
    PAYMENT_ERRORS,
    EVOUCHER_STATUSES,
}) => ({
    createEvoucher: async (req, res, next) => {
        const { value, error } = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().optional(),
            expirationDate: Joi.date().iso().required(),
            image: Joi.string().optional(),
            amount: Joi.number().required(),
            type: Joi.string()
                .valid(...Object.values(EVOUCHER_TYPES))
                .required(),
            evoucher_username: Joi.string().required(),
            evoucher_mobile: Joi.string().required(),
            purchase_limit: Joi.number().default(3).required(),
            quantity: Joi.number().integer().min(1).default(1).required(),
            createdBy: Joi.objectid(),
        }).validate({ ...req.body, createdBy: req.user._id.toString() });

        if (error) return next(error);

        try {
            const response = await EvoucherController.createEvoucher(value);
            return res.status(201).send(response);
        } catch (e) {
            return next(e);
        }
    },
    updateEvoucher: async (req, res, next) => {
        const { value, error } = Joi.object({
            _id: Joi.string().required(),
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            expirationDate: Joi.date().iso().optional(),
            image: Joi.string().optional(),
            type: Joi.string()
                .valid(...Object.values(EVOUCHER_TYPES))
                .optional(),
            status: Joi.string()
                .valid(EVOUCHER_STATUSES.INACTIVE, EVOUCHER_STATUSES.ACTIVE)
                .optional(),
            purchase_limit: Joi.number().optional(),
        }).validate({ ...req.body, ...req.params });

        if (error) return next(error);

        try {
            const response = await EvoucherController.updateEvoucher(value);
            return res.status(200).send(response);
        } catch (e) {
            return next(e);
        }
    },
    checkoutEvoucher: async (req, res, next) => {
        const { value, error } = Joi.object({
            _id: Joi.objectid().required(),
            card: Joi.object({
                number: Joi.number().required(),
                exp_month: Joi.number().required(),
                exp_year: Joi.number().required(),
                cvc: Joi.number().required(),
            }).required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response = await EvoucherController.checkoutEvoucher(value);
            return res.status(200).send(response);
        } catch (e) {
            if (
                e.message.includes("Card") ||
                e.message.includes("card") ||
                e.message === EVOUCHER_ERRORS.INVALID_STATUS ||
                e.message === PAYMENT_ERRORS.METHOD_NOT_ALLOWED
            ) {
                return res.status(400).send({
                    code: 400,
                    message: e.message,
                });
            }
            if (e.message === EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND) {
                return res.status(400).send({
                    code: 404,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
    checkPromoCodeIsValid: async (req, res, next) => {
        const { value, error } = Joi.object({
            code: Joi.string().length(11).required(),
            mobile: Joi.string().required(),
        }).validate(req.query);

        if (error) return next(error);

        try {
            const response = await EvoucherController.checkPromoCodeIsValid(
                value
            );
            return res.status(200).send(response);
        } catch (e) {
            if (e.message === EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND) {
                return res.status(404).send({
                    code: 404,
                    message: e.message,
                });
            }
            if (
                e.message === EVOUCHER_ERRORS.INVALID_STATUS ||
                e.message === EVOUCHER_ERRORS.INVALID_MOBILE ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_EXPIRED ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_ZERO_BALANCE ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_LIMIT_REACHED
            ) {
                return res.status(400).send({
                    code: 400,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
    useEvoucherPromoCode: async (req, res, next) => {
        const { value, error } = Joi.object({
            code: Joi.string().length(11).required(),
            mobile: Joi.string().required(),
            used_amount: Joi.number().min(0).required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response = await EvoucherController.useEvoucherPromoCode(
                value
            );
            return res.status(200).send(response);
        } catch (e) {
            if (e.message === EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND) {
                return res.status(404).send({
                    code: 404,
                    message: e.message,
                });
            }
            if (
                e.message === EVOUCHER_ERRORS.INVALID_STATUS ||
                e.message === EVOUCHER_ERRORS.INVALID_MOBILE ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_EXPIRED ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_ZERO_BALANCE ||
                e.message === EVOUCHER_ERRORS.EVOUCHER_LIMIT_REACHED
            ) {
                return res.status(400).send({
                    code: 400,
                    message: e.message,
                });
            }
            return next(e);
        }
    },
    getEvouchers: async (req, res, next) => {
        const { value, error } = Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
            mobile: Joi.string().optional(),
        }).validate(req.query);

        if (error) return next(error);

        try {
            const response = await EvoucherController.getEvouchers(value);
            return res.status(200).send(response);
        } catch (e) {
            return next(e);
        }
    },
    getOneEvoucher: async (req, res, next) => {
        const { value, error } = Joi.object({
            _id: Joi.objectid().required(),
        }).validate(req.params);

        if (error) return next(error);

        try {
            const result = await EvoucherController.getOneEvoucher(value._id);
            const response = await adaptor.addQRToEvoucherResponse(result);
            return res.status(200).send(response);
        } catch (e) {
            return next(e);
        }
    },
});
