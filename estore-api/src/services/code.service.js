const axios = require("axios");
const R = require("ramda");

const { redisClient } = require("../loaders/redis.loader");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = () => ({
    getPromoCode: async (code) => {
        const redisKey = code;
        const cachedResponse = await redisClient.get(redisKey);
        if (cachedResponse) {
            return JSON.parse(cachedResponse);
        } else {
            const response = await axios.get(
                `${process.env.PROMO_CODE_SERVICE_HOST}/api/v1/promo_codes/${code}`,
                {
                    headers: {
                        Authorization: process.env.SHARED_SERVER_SECRET,
                    },
                }
            );
            const data = R.prop("data", response);
            await redisClient.set(redisKey, JSON.stringify(data));
            return data;
        }
    },

    generatePromoCodes: async ({
        quantity,
        evoucher,
        evoucher_username,
        evoucher_mobile,
        balance,
    }) => {
        const response = await axios.post(
            `${process.env.PROMO_CODE_SERVICE_HOST}/api/v1/promo_codes`,
            {
                quantity,
                evoucher,
                evoucher_username,
                evoucher_mobile,
                balance,
            },
            {
                headers: {
                    Authorization: process.env.SHARED_SERVER_SECRET,
                },
            }
        );
        return R.prop("data", response);
    },

    getPromoCodesByEvoucherId: async (evoucherId) => {
        // we will directly use the mongodb driver cause we dun want to use CodeModel as another dependency
        const collection = mongoose.connection.db.collection("promo_codes");
        const data = await collection
            .find({ evoucher: ObjectId(evoucherId) })
            .toArray();
        return data;
    },
});
