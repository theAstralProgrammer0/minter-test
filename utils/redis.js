import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.client.on('error', (err) => console.error("Redis client error: ", err));
    this.client.connect().catch((err) => console.error("Redis connect error: ", err));
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      console.log("Redis GET operation successful");
      return value;
    }
    catch(err) {
      console.error("Redis GET operation error: ", err);
      return null;
    }
  }

  async set(key, val, duration) {
    try {
      await this.client.set(key, String(val), { EX: duration });
      console.log("Redis SET operation successful");
    }
    catch(err) {console.error("Redis SET operation error: ", err)};
  }

  async del(key) {
    try {
      await this.client.del(key);
      console.log("Redis DEL operation successful");
    }
    catch(err) {console.error("Redis DEL operation error: ", err)};
  }
}

const redisClient = new RedisClient();
export default redisClient;

