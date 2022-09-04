const ObjectId = require("mongoose").Types.ObjectId;

module.exports = ({ CodeService, EvoucherService }) => ({
    generatePromoCode: async (promoCodeData) => {
        await EvoucherService.getOneEvoucher({
            _id: ObjectId(promoCodeData.evoucher),
        });
        return await CodeService.generatePromoCode({
            ...promoCodeData,
        });
    },
    getOnePromoCode: CodeService.getOnePromoCode,
    usePromoCode: async ({ code, used_amount }) => {
        return await CodeService.usePromoCode({ code, used_amount });
    },
});
