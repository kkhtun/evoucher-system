const generatePromoCodeWorker = require("./code.worker");
const R = require("ramda");
const mongoose = require("mongoose");
const { redisClient } = require("../loaders/redis.loader");

module.exports = ({ CodeModel, PROMO_CODE_ERRORS }) => ({
    generatePromoCode: async ({ quantity, ...data }) => {
        let quantityToGenerate = quantity;
        let output = [];
        let session = await mongoose.startSession();
        while (output.length < quantity) {
            // spawn a worker thread to handle code generation concurrently
            const codes = await generatePromoCodeWorker({
                quantity: quantityToGenerate,
            });
            const existingCodes = await CodeModel.find(
                {
                    promo_code: { $in: codes },
                },
                { promo_code: 1 }
            )
                .lean()
                .then(R.map(R.prop("promo_code")));
            const newCodes = R.filter((c) => !existingCodes.includes(c), codes);
            // if dup key error occur, rollback all transaction
            session.startTransaction();
            try {
                // we do not need to handle IO concurrency cause LibUV already have separate threads for this
                const toInsert = newCodes.map((c) => ({
                    promo_code: c,
                    ...data,
                }));
                const insertedCodes = await CodeModel.insertMany(toInsert);
                output.push(...insertedCodes);
                quantityToGenerate = existingCodes.length;
                await session.commitTransaction();
            } catch (e) {
                await session.abortTransaction();
                if (e.message.includes("duplicate key")) {
                    console.log(
                        "Regenerating Codes due to Mongoose Duplicate Error -> Race Condition?"
                    );
                    continue;
                }
                throw new Error(e.message);
            }
        }

        return { data: output, count: output.length };
    },

    getOnePromoCode: async (code) => {
        const data = await CodeModel.findOne({ promo_code: code });
        if (!data) throw new Error(PROMO_CODE_ERRORS.PROMO_CODE_NOT_FOUND);
        return data;
    },

    usePromoCode: async ({ code, used_amount }) => {
        const promoCode = await CodeModel.findOne({ promo_code: code });
        if (!promoCode) throw new Error(PROMO_CODE_ERRORS.PROMO_CODE_NOT_FOUND);

        if (promoCode.balance <= 0 || promoCode.balance < used_amount) {
            throw new Error(PROMO_CODE_ERRORS.PROMO_CODE_INSUFFICIENT_BALANCE);
        }

        const updatedCode = await CodeModel.findOneAndUpdate(
            { promo_code: code },
            {
                balance: promoCode.balance - used_amount,
                purchased_times: promoCode.purchased_times + 1,
            },
            {
                new: true,
            }
        );

        await redisClient.set(code, JSON.stringify(updatedCode));
        return updatedCode;
    },
});
