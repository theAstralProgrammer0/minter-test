import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';

class UsersController {
  static async postNew(req, res) {
    /* capture the data in the req body */
    const { email, password } = req.body;

    // console.log(req.body);

    /* check if email exists */
    if (!email) {
      console.error('Error -> Missing email');
      res.status(400).json({ error: 'Missing email' });
    }

    /* check if password exists */
    if (!password) {
      console.error('Error -> Missing password');
      res.status(400).json({ error: 'Missing password' });
    }

    /* check if email already exists in db */
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      console.error('Error -> Already exists');
      res.status(400).json({ error: 'Already exists' });
    }

    /* hash the password with sha1 */
    const hashedPassword = sha1(password);

    /* construct new user */
    const newUser = {
      email,
      password: hashedPassword,
    };

    /* insert the new user in the db */
    const result = await dbClient.db.collection('users').insertOne(newUser);

    /* return the newly created user */
    if (result) {
      return res.status(201).json({
        id: result.insertedId,
        email: newUser.email,
      });
    }
    else console.error('Error -> Check connection to db');
  }

  static async getMe(req, res){
    /* retrieve the user based on token */
    // console.log(req.headers);
    const token = req.headers['x-token'];
    /* if no token in header, respond Unauthorized */
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* Check if token is still valid user's Id still exists on redis server */
    const userId = await redisClient.get(`auth_${token}`);
    /* if no userId on redis server, respond Unauthorized */
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* Fetch the user's data from the database */
    console.log('userId: ', userId);
    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    console.log(user);
    /* If no user in db, respond Unauthorized */
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /* respond with the found user */
    return res.status(200).json({
      id: user._id,
      email: user.email,
    });
  }
}

export default UsersController;

