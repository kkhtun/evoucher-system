const checkSharedServerSecretKey = (req, res, next) => {
    if (req.headers.authorization) {
        const auth = req.headers.authorization;
        if (auth === process.env.SHARED_SERVER_SECRET) {
            return next();
        }
    }
    return res.status(403).send({
        code: 403,
        message: "You are not allowed to connect to this service",
    });
};

module.exports = { checkSharedServerSecretKey };
