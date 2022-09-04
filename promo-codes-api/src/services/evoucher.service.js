const mongoose = require("mongoose");

module.exports = ({ EVOUCHER_ERRORS }) => ({
    getOneEvoucher: async (filter) => {
        // we will directly use the mongodb driver cause we dun want to use EvoucherModel as another dependency
        const collection = mongoose.connection.db.collection("evouchers");
        const data = await collection.findOne(filter);

        if (!data) throw new Error(EVOUCHER_ERRORS.EVOUCHER_NOT_FOUND);
        return data;
    },
});
