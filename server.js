import express from 'express';
import routes from './routes/index';

/* create express app */
const app = express();

/* define port */
const port = process.env.PORT || '5000';

/* register middleware to parse incoming json request body to populate req.body */
app.use(express.json());

/* use all routes from routes/index */
app.use(routes);

/* start the server */
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

/* export app */
export default app;

