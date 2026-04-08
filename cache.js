const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

async function getCache(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value) {
  await redis.set(key, JSON.stringify(value), "EX", 300); // 5 min
}

module.exports = { getCache, setCache };