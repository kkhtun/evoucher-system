module.exports = ({ PaymentDiscountService }) => ({
    createPaymentMethod: PaymentDiscountService.createPaymentMethod,
    getPaymentMethods: PaymentDiscountService.getPaymentMethods,
    calculatePaymentDiscount: PaymentDiscountService.calculatePaymentDiscount,
});
