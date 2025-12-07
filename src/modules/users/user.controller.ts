import e, { Request, Response } from 'express';
import { userService } from './user.service';
import { bookService } from '../bookings/book.service';

const getUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const result = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: 'All users fetched successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userService.getSingleUser(userId!);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, role } = req.body;
    console.log(typeof req.user?.id);
    // Admin: Update any user's role or details

    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const result = await userService.updateUser(
      userId!,
      name,
      email,
      phone,
      role
    );
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const user = await userService.getSingleUser(userId!);
    if (!user || user.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const activeBookings = await bookService.getActiveBookingsByUser(userId!);
    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active bookings',
      });
    }

    const result = await userService.deleteUser(userId!);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userController = {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
