const initContainerLayers = require("./container.loader");
const asyncDatabaseLoader = require("./db.loader");
const mainRouterInjector = require("../routes");

module.exports = {
    bootstrapLoaders() {
        const container = initContainerLayers([
            "models",
            "services",
            "controllers",
            "handlers",
            "routes",
            "constants",
        ]);

        const routes = mainRouterInjector(container);
        const databaseConnection = asyncDatabaseLoader(process.env.MONGO_URL);
        return { routes, databaseConnection };
    },
};
