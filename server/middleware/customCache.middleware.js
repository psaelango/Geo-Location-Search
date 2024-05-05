class Cache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key];
  }

  set(key, value) {
    this.cache[key] = value;
  }
}

const cache = new Cache();

const cacheMiddleware = (req, res, next) => {
  const key = req.url;

  const cachedData = cache.get(key);
  if (cachedData) {
    console.log('Data found in cache');
    res.json({ locations: cachedData });
  } else {
    console.log('Data not found in cache, fetching from API');
    next();
  }
};

module.exports = { cacheMiddleware, cache };
