const passport = require("passport");
const R = require("ramda");
const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

module.exports = ({ UserController, TOKEN_ERRORS }) => ({
    loginUser: (req, res, next) => {
        const { value, error } = Joi.object({
            mobile: Joi.string().required(),
            password: Joi.string().required(),
        }).validate(req.body);

        if (error) return next(error);

        passport.authenticate(
            "local",
            { session: false },
            (err, user, info) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: err.message,
                        code: 401,
                    });
                }
                req.login(user, { session: false }, async (err) => {
                    if (err) {
                        res.status(401).send({
                            code: 401,
                            message: err.message,
                        });
                    }
                    // token generation
                    try {
                        const { token, refreshToken } =
                            await UserController.generateLoginTokens(user);
                        return res.json({
                            user: R.omit(["password"], user),
                            token,
                            refreshToken,
                            tokenDuration:
                                process.env.JWT_ACCESS_TOKEN_DURATION,
                            refreshTokenDuration:
                                process.env.JWT_REFRESH_TOKEN_DURATION,
                        });
                    } catch (e) {
                        return res.status(400).send({
                            message: e.message,
                            code: 400,
                        });
                    }
                });
            }
        )(req, res);
    },
    registerUser: async (req, res, next) => {
        const { value, error } = Joi.object({
            mobile: Joi.string().required(),
            password: Joi.string().required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response = await UserController.registerUser(value);
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
    refreshToken: async (req, res, next) => {
        const { value, error } = Joi.object({
            refreshToken: Joi.string().required(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const response = await UserController.refreshToken(
                value.refreshToken
            );
            return res.status(200).send({
                token: response,
                tokenDuration: process.env.JWT_ACCESS_TOKEN_DURATION,
            });
        } catch (e) {
            if (e.message === "jwt expired") {
                return res.status(400).send({
                    code: 400,
                    message: TOKEN_ERRORS.REFRESH_TOKEN_EXPIRED,
                });
            }
            // catch all custom token errors
            if (R.values(TOKEN_ERRORS).includes(e.message)) {
                return res.status(400).send({
                    code: 400,
                    message: e.message,
                });
            }
            if (e.message) return next(e);
        }
    },
});
