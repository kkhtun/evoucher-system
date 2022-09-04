const { createClient } = require("redis");

const port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOST;

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () =>
    console.log(`Connected to redis server at ${host}:${port}`)
);
module.exports = { redisClient: client };
