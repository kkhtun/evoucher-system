const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
    {
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    user.password = await bcrypt.hash(user.password, 8);
    next();
});

module.exports = mongoose.model("User", UserSchema, "users");
