import express, { Request, Response } from 'express';
import { initDB } from './config/db';
import { userRoute } from './modules/users/user.route';

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Vehicle Rental System');
});

// user routes
app.use('/api/v1/users', userRoute);

export default app;
