const R = require("ramda");
const moment = require("moment");

module.exports = ({ EvoucherModel, EVOUCHER_STATUSES, EVOUCHER_ERRORS }) => ({
    createEvoucher: async (data) => {
        const evoucher = new EvoucherModel({ ...data, balance: data.amount });
        return await evoucher.save();
    },
    getOneEvoucher: async (filter) => {
        const evoucher = await EvoucherModel.findOne(filter).lean().exec();
        if (!evoucher) throw new Error(EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND);
        return evoucher;
    },
    activateEvoucher: async ({ _id }) => {
        const evoucher = await EvoucherModel.findById(_id);
        if (!evoucher) throw new Error(EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND);

        if (evoucher.status !== EVOUCHER_STATUSES.PENDING)
            throw new Error(EVOUCHER_ERRORS.INVALID_STATUS);

        evoucher.status = EVOUCHER_STATUSES.ACTIVE;
        return await evoucher.save();
    },
    validateEvoucherWithCode: async ({
        evoucher: evoucherId,
        balance,
        purchased_times,
        evoucher_mobile,
        caller_mobile,
    }) => {
        const evoucher = await EvoucherModel.findById(evoucherId).lean().exec();
        if (!evoucher) throw new Error(EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND);

        // validation logics here
        if (evoucher_mobile !== caller_mobile) {
            throw new Error(EVOUCHER_ERRORS.INVALID_MOBILE);
        }

        if (evoucher.status !== EVOUCHER_STATUSES.ACTIVE) {
            throw new Error(EVOUCHER_ERRORS.INVALID_STATUS);
        }

        if (moment().utc().isAfter(moment(evoucher.expirationDate).utc())) {
            throw new Error(EVOUCHER_ERRORS.EVOUCHER_EXPIRED);
        }

        if (balance <= 0 || purchased_times >= evoucher.purchase_limit) {
            throw new Error(EVOUCHER_ERRORS.EVOUCHER_LIMIT_REACHED);
        }

        return evoucher;
    },
    getEvouchers: async (query) => {
        const { limit, skip, mobile } = query;

        let match = [];
        if (mobile) {
            match = [
                ...match,
                {
                    $match: {
                        evoucher_mobile: {
                            $regex: mobile,
                            $options: "ig",
                        },
                    },
                },
            ];
        }

        const pipeline = [
            ...match,
            {
                $sort: { createdAt: -1 },
            },
            {
                $facet: {
                    data: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $lookup: {
                                from: "promo_codes",
                                localField: "_id",
                                foreignField: "evoucher",
                                as: "codes",
                            },
                        },
                    ],
                    count: [{ $count: "count" }],
                },
            },
        ];

        const [{ data, count }] = await EvoucherModel.aggregate(pipeline);

        return { data: data, count: count[0] ? count[0].count : 0 };
    },
    updateEvoucher: async ({ _id, ...data }) => {
        const updatedEvoucher = await EvoucherModel.findOneAndUpdate(
            { _id },
            data,
            {
                new: true,
            }
        );
        return updatedEvoucher;
    },
});
