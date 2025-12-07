import { pool } from '../../config/db';

const createBooking = async (payload: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date;
  rent_end_date: Date;
  total_price: number;
  status: string;
}) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return result;
};

const getAllBookings = async () => {
  return pool.query(`SELECT * FROM bookings`);
};

const getBookingsByCustomer = async (id: string) => {
  return pool.query(`SELECT * FROM bookings WHERE customer_id = $1 `, [id]);
};

const getBookingById = async (id: string) => {
  return pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
};

const getActiveBookingsByUser = async (userId: string) => {
  return pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
};

const getActiveBookingsByVehicle = async (vehicleId: string) => {
  return pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );
};

const updateBooking = async (id: string, status: string) => {
  return pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [
    status,
    id,
  ]);
};

export const bookService = {
  createBooking,
  getAllBookings,
  getBookingsByCustomer,
  getBookingById,
  getActiveBookingsByUser,
  getActiveBookingsByVehicle,
  updateBooking,
};
