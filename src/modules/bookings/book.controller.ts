import { Request, Response } from 'express';
import { vehicleService } from '../vehicles/vehicle.service';
import { bookService } from './book.service';
import { userService } from '../users/user.service';

enum AvailabilityStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    const customerRes = await userService.getSingleUser(customer_id);
    if (!customerRes.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    const vehicleRes = await vehicleService.getSingleVehicle(vehicle_id);
    if (!vehicleRes.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    }
    const vehicle = vehicleRes.rows[0];

    const activeBookingRes = await bookService.getActiveBookingsByVehicle(
      vehicle_id
    );
    if (
      activeBookingRes.rows.length > 0 ||
      vehicle.availability_status !== AvailabilityStatus.AVAILABLE
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for booking',
      });
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: 'rent_end_date cannot be before rent_start_date',
      });
    }

    const duration =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const total_price = duration * Number(vehicle.daily_rent_price);

    const bookingRes = await bookService.createBooking({
      customer_id,
      vehicle_id,
      rent_start_date: startDate,
      rent_end_date: endDate,
      total_price,
      status: 'active',
    });

    const booking = bookingRes.rows[0];
    booking.vehicle = {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    };

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error: any) {
    console.error('CreateBooking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Role missing',
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    const bookingRes = await bookService.getBookingById(bookingId);
    if (!bookingRes || bookingRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const booking = bookingRes.rows[0];

    if (userRole === 'customer') {
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only cancel their bookings',
        });
      }
      if (booking.customer_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Customers can only cancel their own bookings',
        });
      }
    } else if (userRole === 'admin') {
      if (status !== 'returned') {
        return res.status(403).json({
          success: false,
          message: 'Admins can only mark bookings as returned',
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Invalid user role',
      });
    }

    const updateRes = await bookService.updateBooking(bookingId, status);
    const updatedBooking = updateRes.rows[0];
    let vehicleAvailability = null;
    if (status === 'cancelled' || status === 'returned') {
      await vehicleService.updateVehicleAvailability(
        updatedBooking.vehicle_id,
        'available'
      );
      vehicleAvailability = 'available';
    }

    return res.status(200).json({
      success: true,
      message:
        status === 'returned'
          ? 'Booking marked as returned. Vehicle is now available'
          : 'Booking cancelled. Vehicle is now available',
      data: {
        ...updatedBooking,
        vehicle: {
          availability_status: vehicleAvailability,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id: userId, role } = authUser;
    let bookingsRows;
    if (role === 'admin') {
      const bookingRes = await bookService.getAllBookings();
      bookingsRows = bookingRes.rows;
    } else {
      const bookingRes = await bookService.getBookingsByCustomer(userId);
      bookingsRows = bookingRes.rows;
    }

    const enrichedBookings = [];

    for (const booking of bookingsRows) {
      let customerData = null;
      if (role === 'admin') {
        const customerRes = await userService.getSingleUser(
          booking.customer_id
        );
        if (customerRes.rows.length > 0) {
          const c = customerRes.rows[0];
          customerData = {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
          };
        }
      }

      let vehicleData = null;
      if (booking.vehicle_id) {
        const vehicleRes = await vehicleService.getSingleVehicle(
          booking.vehicle_id
        );
        if (vehicleRes.rows.length > 0) {
          const v = vehicleRes.rows[0];
          vehicleData = {
            id: v.id,
            vehicle_name: v.vehicle_name,
            registration_number: v.registration_number,
            daily_rent_price: Number(v.daily_rent_price),
            type: v.type,
          };
        }
      }

      enrichedBookings.push({
        ...booking,
        total_price: Number(booking.total_price),
        customer: role === 'admin' ? customerData : undefined,
        vehicle: vehicleData,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        role === 'admin'
          ? 'All bookings retrieved successfully'
          : 'Your bookings retrieved successfully',
      data: enrichedBookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
export const bookController = {
  createBooking,
  updateBooking,
  getAllBookings,
};
