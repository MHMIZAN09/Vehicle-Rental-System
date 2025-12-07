import express from 'express';
import { bookController } from './book.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/', auth('admin', 'customer'), bookController.createBooking);

router.get('/', auth('admin', 'customer'), bookController.getAllBookings);

router.put(
  '/:bookingId',
  auth('admin', 'customer'),
  bookController.updateBooking
);
export const bookRoute = router;
