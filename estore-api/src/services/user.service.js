const R = require("ramda");
const jwt = require("jsonwebtoken");
module.exports = ({ UserModel, TOKEN_ERRORS }) => ({
    registerUser: async (data) => {
        const user = new UserModel(data);
        return R.omit(["password"], await user.save());
    },
    generateLoginTokens: async (user) => {
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
        });
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
        });
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: user._id },
            { refreshToken }
        );
        return { token, refreshToken };
    },
    refreshAccessToken: async (refreshToken) => {
        const verify = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await UserModel.findOne({ refreshToken }).lean().exec();
        if (!user) throw new Error(TOKEN_ERRORS.REFRESH_TOKEN_NOT_FOUND);

        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
        });

        return token;
    },
});
