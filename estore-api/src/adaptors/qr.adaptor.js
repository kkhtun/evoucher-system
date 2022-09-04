const qr_code = require("qrcode");
const R = require("ramda");

async function setQrCode(code) {
    return {
        ...code,
        qr_code: await qr_code.toDataURL(R.prop("promo_code")(code)),
    };
}

async function addQRToEvoucherResponse(evoucher) {
    const { codes } = evoucher;
    evoucher.codes = await Promise.all(codes.map(setQrCode));
    return evoucher;
}

module.exports = { addQRToEvoucherResponse };
