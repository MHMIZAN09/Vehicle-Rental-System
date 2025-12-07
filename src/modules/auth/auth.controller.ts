import { Request, Response } from 'express';
import { authService } from './auth.service';

enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const emailLower = email.toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of the following: ${Object.values(
          UserRole
        ).join(', ')}`,
      });
    }

    const result = await authService.signUpUser({
      name,
      email: emailLower,
      password,
      phone,
      role,
    });
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const result = await authService.signInUser(emailLower, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  signUpUser,
  signInUser,
};
