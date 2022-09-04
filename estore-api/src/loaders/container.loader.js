const awilix = require("awilix");

function loadModels(container) {
    let mapping = {
        UserModel: require("../models/user.model"),
        EvoucherModel: require("../models/evouchers.model"),
        PaymentDiscountModel: require("../models/payment-discounts.model"),
    };
    Object.keys(mapping).forEach((key) => {
        let model = mapping[key];
        container.register({
            [key]: awilix.asValue(model),
        });
    });
}

function loadServices(container) {
    let mapping = {
        UserService: require("../services/user.service"),
        EvoucherService: require("../services/evoucher.service"),
        PaymentDiscountService: require("../services/payment-discount.service"),
        CodeService: require("../services/code.service"),
    };
    Object.keys(mapping).forEach((key) => {
        let service = mapping[key];
        container.register({
            [key]: awilix.asFunction(service),
        });
    });
}

function loadControllers(container) {
    let mapping = {
        UserController: require("../controllers/user.controller"),
        EvoucherController: require("../controllers/evoucher.controller"),
        PaymentDiscountController: require("../controllers/payment-discount.controller"),
    };
    Object.keys(mapping).forEach((key) => {
        let controller = mapping[key];
        container.register({
            [key]: awilix.asFunction(controller),
        });
    });
}

function loadHandlers(container) {
    let mapping = {
        UserHandler: require("../handlers/user.handler"),
        EvoucherHandler: require("../handlers/evoucher.handler"),
        PaymentDiscountHandler: require("../handlers/payment-discount.handler"),
    };
    Object.keys(mapping).forEach((key) => {
        let handler = mapping[key];
        container.register({
            [key]: awilix.asFunction(handler),
        });
    });
}

function loadRoutes(container) {
    let mapping = {
        UsersRouter: require("../routers/users.router"),
        EvouchersRouter: require("../routers/evouchers.router"),
        PaymentDiscountsRouter: require("../routers/payment-discount.router"),
    };
    Object.keys(mapping).forEach((key) => {
        let route = mapping[key];
        container.register({
            [key]: awilix.asFunction(route),
        });
    });
}

function loadConstants(container) {
    let mapping = {
        ...require("../config/errors.constants"),
        ...require("../config/evoucher.constants"),
        ...require("../config/cards.constants"),
    };
    Object.keys(mapping).forEach((key) => {
        let constant = mapping[key];
        container.register({
            [key]: awilix.asValue(constant),
        });
    });
}

function initContainer(layers = []) {
    const container = awilix.createContainer();
    const layerMapping = {
        models: loadModels,
        services: loadServices,
        controllers: loadControllers,
        handlers: loadHandlers,
        routes: loadRoutes,
        constants: loadConstants,
    };

    const definedLayers = Object.keys(layerMapping);
    layers = layers.filter((l) => definedLayers.includes(l));
    layers.forEach((key) => layerMapping[key](container)); // Above functions are called here, and layers are injected
    return container;
}

module.exports = initContainer;
