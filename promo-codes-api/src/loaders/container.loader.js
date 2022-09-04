const awilix = require("awilix");

function loadModels(container) {
    let mapping = {
        CodeModel: require("../models/code.model"),
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
        CodeService: require("../services/code.service"),
        EvoucherService: require("../services/evoucher.service"),
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
        CodeController: require("../controllers/code.controller"),
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
        CodeHandler: require("../handlers/code.handler"),
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
        CodesRouter: require("../routers/codes.router"),
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
        ...require("../config/evoucher.constants"),
        ...require("../config/errors.constants"),
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
