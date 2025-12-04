import { Request, Response } from 'express';
import { userService } from './user.service';

enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    // check email lower case
    const emailLower = email.toLowerCase();

    // password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }
    // role check
    const roleOptions = Object.values(UserRole);
    console.log(roleOptions);
    if (!roleOptions.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of the following: ${roleOptions.join(', ')}`,
      });
    }

    const result = await userService.createUser({
      name,
      email: emailLower,
      password,
      phone,
      role,
    });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  createUser,
};
