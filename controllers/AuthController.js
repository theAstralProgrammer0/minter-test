import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    /* capture the request header if any */
    const authHeaders = req.headers.authorization;
    // console.log(authHeaders);
    
    /* parse the base64 basic auth token */
    const base64Credentials = authHeaders.split(' ')[1];
    
    /* if no basic auth token, respond Unauthorized*/
    if (!base64Credentials) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* create Buffer object from base64Credentials string
     * base64 denotes the encoding type
     * decode base64 credentials to utf-8 string
     * The result is the credentials "email:pass" in plain string
     */
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    // console.log(credentials);

    /* capture username and password from credentials */
    const [email, password] = credentials.split(':');
    
    /* hash the password */
    const hashedPassword = sha1(password);

    /* check if the credentials match any user's credentials in the db */
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
    /* check if user not exists, respond Unauthorized */
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* After user has authenticated, generate redis session token */
    const token = uuidv4();
    
    /* construct redis key for auth user */
    const key = `auth_${token}`;

    /* set the redis entry for the auth user and await it*/
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

    /* return token */
    return res.status(201).json({ token });
  }

  static async getDisconnect(req, res) {
    /* capture the token from the request header */
    const token = req.headers['x-token'];
    /* if there's no token in the req header, respond Unauthorized */
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* ensure there is a user mapped to provided token */
    const userId = await redisClient.get(`auth_${token}`);
    /* if no user id is returned, respond Unauthorized */
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* Delete the user from the redis server and await it*/
    await redisClient.del(`auth_${token}`);

    /* Respond with success status for the delete operation */
    return res.status(204).send();
  }
}

export default AuthController;

