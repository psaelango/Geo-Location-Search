const { getFromCache } = require("../utils/redisCache");

const redisCacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;

  getFromCache(cacheKey)
    .then((cachedData) => {
      if (cachedData) {
        console.log("Data found in cache");
        res.json(cachedData);
      } else {
        console.log("Data not found in cache, fetching from API");
        next();
      }
    })
    .catch((error) => {
      console.error("Error checking cache:", error);
      next();
    });
};

module.exports = redisCacheMiddleware;
