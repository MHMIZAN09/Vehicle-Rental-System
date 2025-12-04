import { pool } from '../../config/db';

const createUser = (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const result = pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, email, password, phone, role]
  );

  return result;
};

export const userService = {
  createUser,
};
