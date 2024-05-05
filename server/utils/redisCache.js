const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
client.connect();

client.on("connect", () => console.log("Redis Client Connected"));
client.on("error", (err) => console.log("Redis Client Connection Error", err));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const getFromCache = async (key) => {
  const cachedData = await getAsync(key);
  return JSON.parse(cachedData);
};

const setToCache = async (key, data, ttlInSeconds = 3600) => {
  await setAsync(key, JSON.stringify(data), "EX", ttlInSeconds);
};

module.exports = { getFromCache, setToCache };
