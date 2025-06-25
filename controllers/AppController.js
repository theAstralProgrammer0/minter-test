import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/* define the AppController class */
class AppController {
  /* define the getStatus method */
  static getStatus(req, res) {
    /* define Redis and DB alive bool states as variables */
    const redisAlive = redisClient.isAlive();
    const dbAlive = dbClient.isAlive();
    res.status(200).json({ "redis": redisAlive, "db": dbAlive });
  }

  /* define the getStats method */
  static async getStats(req, res) {
    try {
      const user_count = await dbClient.nbUsers();
      const file_count = await dbClient.nbFiles();
      res.status(200).json({ "users": user_count, "files": file_count });
    }
    catch(err) {throw err};
  }
}

export default AppController;
