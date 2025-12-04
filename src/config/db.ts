import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(250) NOT NULL,
    type VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    daily_rent_price NUMERIC NOT NULL,
    availability_status VARCHAR(50) NOT NULL    
  )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status VARCHAR(50) NOT NULL
    )
  `);

  console.log('DataBase Connection Successfully.......');
};
