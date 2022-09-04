// passport.jsconst passport = require('passport’);
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: "mobile",
            passwordField: "password",
        },
        function (mobile, password, cb) {
            return UserModel.findOne({ mobile })
                .select("+password")
                .lean()
                .then((user) => {
                    const errorMessage = {
                        message: "Incorrect Credentials",
                    };
                    if (!user) {
                        return cb(errorMessage, false, errorMessage);
                    }
                    bcrypt.compare(
                        password,
                        user.password,
                        function (err, result) {
                            if (result) {
                                return cb(null, user, {
                                    message: "Logged In Successfully",
                                });
                            }
                            return cb(errorMessage, false);
                        }
                    );
                })
                .catch((err) => cb(err));
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        function (jwtPayload, cb) {
            return UserModel.findById(jwtPayload._id)
                .lean()
                .then((user) => {
                    return cb(null, user);
                })
                .catch((err) => {
                    return cb(err);
                });
        }
    )
);
