import express, { Request, Response } from 'express';
import { initDB } from './config/db';
import { userRoute } from './modules/users/user.route';
import { vehicleRoute } from './modules/vehicles/vehicle.route';
import { bookRoute } from './modules/bookings/book.route';
import { authRoute } from './modules/auth/auth.route';

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Vehicle Rental System');
});

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/users', userRoute);


app.use('/api/v1/vehicles', vehicleRoute);


app.use('/api/v1/bookings', bookRoute);

export default app;
