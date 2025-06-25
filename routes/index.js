import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

/* create express router */
const router = Router();

/* map all routes to their controller methods */

/* GET status of redis and mongodb session: see if alive or dead */
router.get('/status', AppController.getStatus);
/* GET count of collections in db */
router.get('/stats', AppController.getStats);
/* POST new user in db */
router.post('/users', UsersController.postNew);
/* GET new auth token and user sign-in */
router.get('/connect', AuthController.getConnect);
/* GET user based on token and user sign-out */
router.get('/disconnect', AuthController.getDisconnect);
/* GET user based on token and user object return */
router.get('/users/me', UsersController.getMe);

/* export router */
export default router;

