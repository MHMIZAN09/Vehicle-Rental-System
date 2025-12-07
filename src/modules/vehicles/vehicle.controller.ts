import { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';
import { bookService } from '../bookings/book.service';

enum VehicleType {
  CAR = 'car',
  BIKE = 'bike',
  VAN = 'van',
  SUV = 'SUV',
}

enum AvailabilityStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (!Object.values(VehicleType).includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Vehicle type must be one of the following: ${Object.values(
          VehicleType
        ).join(', ')}`,
      });
    }

    if (daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Daily rent price must be a positive number',
      });
    }

    if (!Object.values(AvailabilityStatus).includes(availability_status)) {
      return res.status(400).json({
        success: false,
        message: `Availability status must be one of the following: ${Object.values(
          AvailabilityStatus
        ).join(', ')}`,
      });
    }

    const result = await vehicleService.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicle();
    res.status(200).json({
      success: true,
      message: 'All vehicles fetched successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.getSingleVehicle(vehicleId as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    res.status(200).json({
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

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    const result = await vehicleService.updateVehicle(
      vehicleId!,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (req.user?.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden: Admins only' });
    }

    // Check if vehicle exists
    const vehicle = await vehicleService.getSingleVehicle(vehicleId!);
    if (!vehicle || vehicle.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    }

    const activeBookings = await bookService.getActiveBookingsByVehicle(
      vehicleId!
    );
    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active bookings',
      });
    }

    const result = await vehicleService.deleteVehicle(vehicleId!);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: result.rows,
    });
  } catch (error: any) {
    console.error('DeleteVehicle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
export const vehicleController = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
